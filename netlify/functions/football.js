const API_BASE = "https://v3.football.api-sports.io";

/*
  Endpoints que permitimos utilizar desde nuestra web.

  Esto evita convertir nuestra función en un proxy abierto
  hacia cualquier endpoint.
*/

const ALLOWED_ENDPOINTS = new Set([
  "fixtures",
  "fixtures/events",
  "fixtures/statistics",
  "fixtures/lineups",

  "standings",

  "leagues",

  "teams",
  "teams/statistics",

  "players",
  "players/topscorers",
  "players/topassists"
]);


/*
  Parámetros que nunca permitiremos enviar desde el navegador.
*/

const BLOCKED_PARAMS = new Set([
  "key",
  "api_key",
  "apikey",
  "x-apisports-key"
]);


exports.handler = async function (event) {

  /*
    Solo aceptamos GET.
  */

  if (event.httpMethod !== "GET") {

    return createResponse(
      405,
      {
        error: "Método no permitido."
      },
      0
    );

  }


  try {

    /*
      La API key viene desde las variables
      secretas de Netlify.
    */

    const API_KEY =
      process.env.API_FOOTBALL_KEY;


    if (!API_KEY) {

      return createResponse(
        500,
        {
          error:
            "API_FOOTBALL_KEY no está configurada en Netlify."
        },
        0
      );

    }


    const params =
      event.queryStringParameters || {};


    const endpoint =
      String(params.endpoint || "").trim();


    /*
      Revisamos que el endpoint exista
      y esté autorizado.
    */

    if (
      !endpoint ||
      !ALLOWED_ENDPOINTS.has(endpoint)
    ) {

      return createResponse(
        400,
        {
          error: "Endpoint no permitido."
        },
        0
      );

    }


    /*
      Creamos los parámetros que enviaremos
      a API-Football.
    */

    const query =
      new URLSearchParams();


    for (
      const [key, rawValue]
      of Object.entries(params)
    ) {

      if (key === "endpoint") {
        continue;
      }


      if (
        BLOCKED_PARAMS.has(
          key.toLowerCase()
        )
      ) {
        continue;
      }


      if (
        rawValue === undefined ||
        rawValue === null ||
        rawValue === ""
      ) {
        continue;
      }


      const value =
        String(rawValue).slice(0, 500);


      query.append(
        key,
        value
      );

    }


    const queryString =
      query.toString();


    const url =
      `${API_BASE}/${endpoint}` +
      (
        queryString
          ? `?${queryString}`
          : ""
      );


    /*
      Petición real a API-Football.
    */

    const apiResponse =
      await fetch(
        url,
        {
          method: "GET",

          headers: {
            "x-apisports-key":
              API_KEY
          }
        }
      );


    let data;


    try {

      data =
        await apiResponse.json();

    } catch {

      return createResponse(
        502,
        {
          error:
            "API-Football devolvió una respuesta inválida."
        },
        0
      );

    }


    /*
      Si API-Football devuelve error HTTP.
    */

    if (!apiResponse.ok) {

      return createResponse(
        apiResponse.status,
        {
          error:
            "API-Football devolvió un error.",

          details:
            data
        },
        0
      );

    }


    /*
      El tiempo de caché depende del endpoint.
    */

    const cacheSeconds =
      getCacheTime(endpoint);


    return createResponse(
      200,
      data,
      cacheSeconds
    );


  } catch (error) {

    console.error(
      "Football Function Error:",
      error
    );


    return createResponse(
      500,
      {
        error:
          "Error interno del servidor."
      },
      0
    );

  }

};


/*
  Controlamos cuánto tiempo puede
  mantenerse una respuesta en caché.

  Los partidos necesitan actualizarse
  más rápido.

  Las tablas y ligas cambian menos.
*/

function getCacheTime(endpoint) {

  switch (endpoint) {

    case "fixtures":
      return 30;

    case "fixtures/events":
      return 30;

    case "fixtures/statistics":
      return 60;

    case "fixtures/lineups":
      return 300;

    case "standings":
      return 900;

    case "players/topscorers":
      return 1800;

    case "players/topassists":
      return 1800;

    case "leagues":
      return 3600;

    default:
      return 300;

  }

}


/*
  Construimos la respuesta para Netlify.
*/

function createResponse(
  statusCode,
  data,
  cacheSeconds = 0
) {

  return {

    statusCode,

    headers: {

      "Content-Type":
        "application/json; charset=utf-8",

      "Access-Control-Allow-Origin":
        "*",

      "X-Content-Type-Options":
        "nosniff",

      "Cache-Control":
        cacheSeconds > 0

          ? `public, max-age=${cacheSeconds}`

          : "no-store"
    },

    body:
      JSON.stringify(data)

  };

}
