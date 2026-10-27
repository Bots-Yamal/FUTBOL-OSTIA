/* ==========================================================
   FÚTBOL LIVE
   Frontend principal
========================================================== */


const API_URL =
  "/.netlify/functions/football";


/*
  IMPORTANTE:

  Los IDs corresponden a competiciones de API-Football.

  Algunas competiciones internacionales no tienen partidos
  durante todo el año.

  La temporada se obtiene dinámicamente cuando es necesario.
*/


const LEAGUES = [

  {
    id: 2,
    name: "UEFA Champions League",
    country: "Europa",
    aliases: [
      "champions",
      "champions league",
      "liga de campeones"
    ]
  },

  {
    id: 3,
    name: "UEFA Europa League",
    country: "Europa",
    aliases: [
      "europa league"
    ]
  },

  {
    id: 848,
    name: "UEFA Conference League",
    country: "Europa",
    aliases: [
      "conference",
      "conference league"
    ]
  },

  {
    id: 39,
    name: "Premier League",
    country: "Inglaterra",
    aliases: [
      "premier",
      "liga inglesa",
      "inglaterra"
    ]
  },

  {
    id: 40,
    name: "Championship",
    country: "Inglaterra",
    aliases: [
      "efl championship"
    ]
  },

  {
    id: 140,
    name: "LaLiga",
    country: "España",
    aliases: [
      "laliga",
      "la liga",
      "liga española",
      "liga de españa",
      "españa"
    ]
  },

  {
    id: 141,
    name: "Segunda División",
    country: "España",
    aliases: [
      "segunda",
      "laliga 2",
      "segunda española"
    ]
  },

  {
    id: 135,
    name: "Serie A",
    country: "Italia",
    aliases: [
      "serie a italiana",
      "liga italiana"
    ]
  },

  {
    id: 136,
    name: "Serie B",
    country: "Italia",
    aliases: [
      "serie b italiana"
    ]
  },

  {
    id: 78,
    name: "Bundesliga",
    country: "Alemania",
    aliases: [
      "liga alemana"
    ]
  },

  {
    id: 79,
    name: "2. Bundesliga",
    country: "Alemania",
    aliases: [
      "segunda alemana"
    ]
  },

  {
    id: 61,
    name: "Ligue 1",
    country: "Francia",
    aliases: [
      "liga francesa",
      "liga 1",
      "francia"
    ]
  },

  {
    id: 62,
    name: "Ligue 2",
    country: "Francia",
    aliases: [
      "liga 2 francesa"
    ]
  },

  {
    id: 88,
    name: "Eredivisie",
    country: "Países Bajos",
    aliases: [
      "liga holandesa",
      "holanda"
    ]
  },

  {
    id: 94,
    name: "Primeira Liga",
    country: "Portugal",
    aliases: [
      "liga portuguesa",
      "portugal"
    ]
  },

  {
    id: 144,
    name: "Belgian Pro League",
    country: "Bélgica",
    aliases: [
      "liga belga",
      "belgica"
    ]
  },

  {
    id: 203,
    name: "Süper Lig",
    country: "Turquía",
    aliases: [
      "super lig",
      "liga turca",
      "turquia"
    ]
  },

  {
    id: 179,
    name: "Scottish Premiership",
    country: "Escocia",
    aliases: [
      "liga escocesa"
    ]
  },

  {
    id: 71,
    name: "Brasileirão Série A",
    country: "Brasil",
    aliases: [
      "brasileirao",
      "brasil",
      "liga brasileña"
    ]
  },

  {
    id: 128,
    name: "Liga Profesional Argentina",
    country: "Argentina",
    aliases: [
      "liga argentina",
      "argentina"
    ]
  },

  {
    id: 13,
    name: "Copa Libertadores",
    country: "Sudamérica",
    aliases: [
      "libertadores"
    ]
  },

  {
    id: 11,
    name: "Copa Sudamericana",
    country: "Sudamérica",
    aliases: [
      "sudamericana"
    ]
  },

  {
    id: 253,
    name: "Major League Soccer",
    country: "Estados Unidos",
    aliases: [
      "mls"
    ]
  },

  {
    id: 262,
    name: "Liga MX",
    country: "México",
    aliases: [
      "liga mexicana",
      "mexico"
    ]
  },

  {
    id: 307,
    name: "Saudi Pro League",
    country: "Arabia Saudita",
    aliases: [
      "liga saudita",
      "saudi league"
    ]
  },

  {
    id: 98,
    name: "J1 League",
    country: "Japón",
    aliases: [
      "liga japonesa",
      "japon"
    ]
  },

  {
    id: 17,
    name: "AFC Champions League",
    country: "Asia",
    aliases: [
      "champions asia",
      "champions de asia"
    ]
  },

  {
    id: 1,
    name: "Copa Mundial",
    country: "Mundial",
    aliases: [
      "mundial",
      "world cup"
    ]
  },

  {
    id: 4,
    name: "Eurocopa",
    country: "Europa",
    aliases: [
      "euro",
      "eurocopa"
    ]
  },

  {
    id: 9,
    name: "Copa América",
    country: "Sudamérica",
    aliases: [
      "copa america"
    ]
  }

];


/* ==========================================================
   ESTADO
========================================================== */


let selectedDate =
  new Date();


let currentFilter =
  "all";


let currentFixtures =
  [];


let selectedLeague =
  null;


let selectedFixture =
  null;


let leagueMetadata =
  new Map();


let favorites =
  loadFavorites();


/* ==========================================================
   ELEMENTOS
========================================================== */


const leagueSearch =
  document.getElementById("leagueSearch");


const searchResults =
  document.getElementById("searchResults");


const clearSearch =
  document.getElementById("clearSearch");


const matchesContainer =
  document.getElementById("matchesContainer");


const matchCount =
  document.getElementById("matchCount");


const loading =
  document.getElementById("loading");


const emptyBox =
  document.getElementById("emptyBox");


const errorBox =
  document.getElementById("errorBox");


const errorMessage =
  document.getElementById("errorMessage");


const currentDateElement =
  document.getElementById("currentDate");


const dateLabel =
  document.getElementById("dateLabel");


const leaguesGrid =
  document.getElementById("leaguesGrid");


const leagueContent =
  document.getElementById("leagueContent");


const matchContent =
  document.getElementById("matchContent");


const matchHero =
  document.getElementById("matchHero");


/* ==========================================================
   API
========================================================== */


async function apiRequest(
  endpoint,
  params = {}
) {

  const query =
    new URLSearchParams({
      endpoint,
      ...params
    });


  const response =
    await fetch(
      `${API_URL}?${query.toString()}`
    );


  let data;


  try {

    data =
      await response.json();

  } catch {

    throw new Error(
      "El servidor devolvió una respuesta inválida."
    );

  }


  if (!response.ok) {

    throw new Error(
      data.error ||
      "No se pudo consultar la API."
    );

  }


  if (
    data.errors &&
    Object.keys(data.errors).length
  ) {

    console.warn(
      "API-Football:",
      data.errors
    );

  }


  return data;

}


/* ==========================================================
   FECHAS
========================================================== */


function formatAPIDate(date) {

  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;

}


function isSameDay(a, b) {

  return (
    a.getFullYear() ===
      b.getFullYear() &&

    a.getMonth() ===
      b.getMonth() &&

    a.getDate() ===
      b.getDate()
  );

}


function updateDateUI() {

  const today =
    new Date();


  const tomorrow =
    new Date();


  tomorrow.setDate(
    today.getDate() + 1
  );


  const yesterday =
    new Date();


  yesterday.setDate(
    today.getDate() - 1
  );


  if (
    isSameDay(
      selectedDate,
      today
    )
  ) {

    dateLabel.textContent =
      "Hoy";

  }

  else if (
    isSameDay(
      selectedDate,
      tomorrow
    )
  ) {

    dateLabel.textContent =
      "Mañana";

  }

  else if (
    isSameDay(
      selectedDate,
      yesterday
    )
  ) {

    dateLabel.textContent =
      "Ayer";

  }

  else {

    dateLabel.textContent =
      selectedDate
        .toLocaleDateString(
          "es-ES",
          {
            weekday: "long"
          }
        );

  }


  currentDateElement.textContent =
    selectedDate
      .toLocaleDateString(
        "es-ES",
        {
          day: "numeric",
          month: "long"
        }
      );

}


/* ==========================================================
   PARTIDOS
========================================================== */


async function loadFixtures() {

  showLoading();


  try {

    const date =
      formatAPIDate(
        selectedDate
      );


    /*
      Una consulta por fecha obtiene los partidos disponibles.

      Luego filtramos localmente las 30 competiciones.

      Esto ahorra MUCHÍSIMAS peticiones frente a hacer
      una petición independiente por liga.
    */


    const data =
      await apiRequest(
        "fixtures",
        {
          date
        }
      );


    const allowedLeagueIDs =
      new Set(
        LEAGUES.map(
          league => league.id
        )
      );


    currentFixtures =
      (data.response || [])
        .filter(
          item =>
            allowedLeagueIDs.has(
              item.league.id
            )
        );


    /*
      Guardamos logos y temporadas que nos entrega
      la propia respuesta.
    */


    currentFixtures.forEach(
      fixture => {

        leagueMetadata.set(
          fixture.league.id,
          {
            logo:
              fixture.league.logo,

            season:
              fixture.league.season,

            country:
              fixture.league.country
          }
        );

      }
    );


    renderFixtures();

  } catch (error) {

    showError(
      error.message
    );

  }

}


/* ==========================================================
   FILTRAR PARTIDOS
========================================================== */


function fixtureCategory(fixture) {

  const status =
    fixture.fixture.status.short;


  const liveStatuses =
    [
      "1H",
      "HT",
      "2H",
      "ET",
      "BT",
      "P",
      "SUSP",
      "INT",
      "LIVE"
    ];


  const finishedStatuses =
    [
      "FT",
      "AET",
      "PEN"
    ];


  if (
    liveStatuses.includes(status)
  ) {

    return "live";

  }


  if (
    finishedStatuses.includes(status)
  ) {

    return "finished";

  }


  return "upcoming";

}


/* ==========================================================
   RENDER PARTIDOS
========================================================== */


function renderFixtures() {

  hideMessages();


  const fixtures =
    currentFixtures.filter(
      fixture => {

        if (
          currentFilter === "all"
        ) {

          return true;

        }


        return (
          fixtureCategory(
            fixture
          ) === currentFilter
        );

      }
    );


  matchCount.textContent =
    fixtures.length;


  if (!fixtures.length) {

    emptyBox.classList.remove(
      "hidden"
    );

    matchesContainer.innerHTML =
      "";

    return;

  }


  /*
    Agrupamos por liga.
  */


  const groups =
    new Map();


  fixtures.forEach(
    fixture => {

      const id =
        fixture.league.id;


      if (!groups.has(id)) {

        groups.set(
          id,
          {
            league:
              fixture.league,

            fixtures: []
          }
        );

      }


      groups
        .get(id)
        .fixtures
        .push(fixture);

    }
  );


  matchesContainer.innerHTML =
    "";


  for (
    const group
    of groups.values()
  ) {

    const section =
      document.createElement(
        "section"
      );


    section.className =
      "league-group";


    section.innerHTML = `

      <div
        class="league-header"
        data-league-id="${group.league.id}"
      >

        <img
          src="${escapeHTML(group.league.logo)}"
          alt=""
        >

        <div class="league-header-text">

          <strong>
            ${escapeHTML(group.league.name)}
          </strong>

          <small>
            ${escapeHTML(group.league.country || "")}
          </small>

        </div>

        <span>›</span>

      </div>

      <div class="league-matches"></div>

    `;


    const container =
      section.querySelector(
        ".league-matches"
      );


    group.fixtures.forEach(
      fixture => {

        container.appendChild(
          createMatchCard(
            fixture
          )
        );

      }
    );


    section
      .querySelector(
        ".league-header"
      )
      .addEventListener(
        "click",
        () =>
          openLeague(
            group.league.id
          )
      );


    matchesContainer
      .appendChild(section);

  }

}


/* ==========================================================
   TARJETA DE PARTIDO
========================================================== */


function createMatchCard(
  fixture
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "match-card";


  const home =
    fixture.teams.home;


  const away =
    fixture.teams.away;


  const category =
    fixtureCategory(
      fixture
    );


  let score;


  if (
    category === "upcoming"
  ) {

    score =
      formatKickoff(
        fixture.fixture.date
      );

  }

  else {

    score =
      `${fixture.goals.home ?? 0} - ${fixture.goals.away ?? 0}`;

  }


  const status =
    getStatusText(
      fixture
    );


  const isFavorite =
    favorites.includes(
      fixture.fixture.id
    );


  card.innerHTML = `

    <button
      class="favorite-match ${isFavorite ? "saved" : ""}"
      aria-label="Favorito"
    >
      ★
    </button>


    <div class="team">

      <img
        src="${escapeHTML(home.logo)}"
        alt=""
      >

      <span class="team-name">
        ${escapeHTML(home.name)}
      </span>

    </div>


    <div class="score-area">

      <div class="score">
        ${escapeHTML(score)}
      </div>

      <span
        class="match-status ${category === "live" ? "live" : ""}"
      >
        ${escapeHTML(status)}
      </span>

    </div>


    <div class="team">

      <img
        src="${escapeHTML(away.logo)}"
        alt=""
      >

      <span class="team-name">
        ${escapeHTML(away.name)}
      </span>

    </div>

  `;


  card.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          ".favorite-match"
        )
      ) {

        return;

      }


      openMatch(
        fixture
      );

    }
  );


  card
    .querySelector(
      ".favorite-match"
    )
    .addEventListener(
      "click",
      event => {

        event.stopPropagation();

        toggleFavorite(
          fixture.fixture.id
        );

        event.currentTarget
          .classList
          .toggle("saved");

      }
    );


  return card;

}


/* ==========================================================
   ESTADO DEL PARTIDO
========================================================== */


function getStatusText(
  fixture
) {

  const status =
    fixture.fixture.status;


  const category =
    fixtureCategory(
      fixture
    );


  if (
    category === "live"
  ) {

    if (
      status.elapsed !== null &&
      status.elapsed !== undefined
    ) {

      return `${status.elapsed}' EN VIVO`;

    }


    return "EN VIVO";

  }


  const translations = {

    NS:
      "Próximo",

    TBD:
      "Por definir",

    PST:
      "Pospuesto",

    CANC:
      "Cancelado",

    ABD:
      "Abandonado",

    FT:
      "Final",

    AET:
      "Final · Prórroga",

    PEN:
      "Final · Penales"

  };


  return (
    translations[
      status.short
    ] ||
    status.long ||
    ""
  );

}


/* ==========================================================
   CENTRO DE PARTIDO
========================================================== */


async function openMatch(
  fixture
) {

  selectedFixture =
    fixture;


  showView(
    "matchView"
  );


  renderMatchHero(
    fixture
  );


  setMatchTabActive(
    "summary"
  );


  await loadMatchSummary();

}


/* ==========================================================
   HERO PARTIDO
========================================================== */


function renderMatchHero(
  fixture
) {

  const category =
    fixtureCategory(
      fixture
    );


  const score =
    category === "upcoming"

      ? formatKickoff(
          fixture.fixture.date
        )

      : `${fixture.goals.home ?? 0} - ${fixture.goals.away ?? 0}`;


  matchHero.innerHTML = `

    <div class="match-competition">

      ${escapeHTML(fixture.league.name)}

      ·

      ${escapeHTML(
        fixture.fixture.venue?.name ||
        "Estadio por confirmar"
      )}

    </div>


    <div class="match-hero-teams">

      <div class="hero-team">

        <img
          src="${escapeHTML(fixture.teams.home.logo)}"
          alt=""
        >

        <strong>
          ${escapeHTML(fixture.teams.home.name)}
        </strong>

      </div>


      <div>

        <div class="hero-score">
          ${escapeHTML(score)}
        </div>

        <div class="hero-status">
          ${escapeHTML(getStatusText(fixture))}
        </div>

      </div>


      <div class="hero-team">

        <img
          src="${escapeHTML(fixture.teams.away.logo)}"
          alt=""
        >

        <strong>
          ${escapeHTML(fixture.teams.away.name)}
        </strong>

      </div>

    </div>

  `;

}


/* ==========================================================
   RESUMEN
========================================================== */


async function loadMatchSummary() {

  matchContent.innerHTML =
    loadingHTML();


  try {

    const data =
      await apiRequest(
        "fixtures/events",
        {
          fixture:
            selectedFixture.fixture.id
        }
      );


    renderEvents(
      data.response || [],
      true
    );

  } catch (error) {

    renderContentError(
      error
    );

  }

}


/* ==========================================================
   EVENTOS
========================================================== */


async function loadEvents() {

  matchContent.innerHTML =
    loadingHTML();


  try {

    const data =
      await apiRequest(
        "fixtures/events",
        {
          fixture:
            selectedFixture.fixture.id
        }
      );


    renderEvents(
      data.response || [],
      false
    );

  } catch (error) {

    renderContentError(
      error
    );

  }

}


function renderEvents(
  events,
  summary
) {

  if (!events.length) {

    matchContent.innerHTML =
      emptyContent(
        "Todavía no hay eventos disponibles."
      );

    return;

  }


  let list =
    events;


  if (
    summary &&
    list.length > 8
  ) {

    list =
      list.slice(-8);

  }


  const html =
    list
      .map(
        event => {

          return `

            <div class="event">

              <span class="event-time">
                ${event.time.elapsed ?? ""}'
              </span>

              <span class="event-icon">
                ${eventIcon(event)}
              </span>

              <div>

                <strong>
                  ${escapeHTML(
                    event.player?.name ||
                    event.team?.name ||
                    "Evento"
                  )}
                </strong>

                <small>
                  ${escapeHTML(
                    eventDetail(event)
                  )}
                </small>

              </div>

            </div>

          `;

        }
      )
      .join("");


  matchContent.innerHTML = `

    <div class="timeline">
      ${html}
    </div>

  `;

}


/* ==========================================================
   ICONOS DE EVENTOS
========================================================== */


function eventIcon(
  event
) {

  if (
    event.type === "Goal"
  ) {

    return "⚽";

  }


  if (
    event.type === "Card"
  ) {

    if (
      String(event.detail)
        .toLowerCase()
        .includes("red")
    ) {

      return "🟥";

    }


    return "🟨";

  }


  if (
    event.type === "subst"
  ) {

    return "🔄";

  }


  if (
    event.type === "Var"
  ) {

    return "📺";

  }


  return "•";

}


function eventDetail(
  event
) {

  if (
    event.type === "subst"
  ) {

    const out =
      event.player?.name ||
      "Jugador";


    const incoming =
      event.assist?.name ||
      "Jugador";


    return `${out} → ${incoming}`;

  }


  if (
    event.type === "Goal"
  ) {

    const assist =
      event.assist?.name;


    return assist
      ? `${event.detail || "Gol"} · Asistencia: ${assist}`
      : event.detail || "Gol";

  }


  return (
    event.detail ||
    event.type ||
    ""
  );

}


/* ==========================================================
   ESTADÍSTICAS
========================================================== */


async function loadStatistics() {

  matchContent.innerHTML =
    loadingHTML();


  try {

    const data =
      await apiRequest(
        "fixtures/statistics",
        {
          fixture:
            selectedFixture.fixture.id
        }
      );


    renderStatistics(
      data.response || []
    );

  } catch (error) {

    renderContentError(
      error
    );

  }

}


function renderStatistics(
  teams
) {

  if (
    !teams ||
    teams.length < 2
  ) {

    matchContent.innerHTML =
      emptyContent(
        "Las estadísticas todavía no están disponibles para este partido."
      );

    return;

  }


  const home =
    teams[0];


  const away =
    teams[1];


  const homeStats =
    statsToMap(
      home.statistics
    );


  const awayStats =
    statsToMap(
      away.statistics
    );


  const wantedStats = [

    ["Ball Possession", "Posesión"],

    ["Total Shots", "Disparos"],

    ["Shots on Goal", "Disparos a puerta"],

    ["Shots off Goal", "Disparos fuera"],

    ["Blocked Shots", "Disparos bloqueados"],

    ["Corner Kicks", "Córners"],

    ["Offsides", "Fuera de juego"],

    ["Fouls", "Faltas"],

    ["Yellow Cards", "Tarjetas amarillas"],

    ["Red Cards", "Tarjetas rojas"],

    ["Goalkeeper Saves", "Atajadas"],

    ["Total passes", "Pases"],

    ["Passes accurate", "Pases completados"],

    ["Passes %", "Precisión de pases"]

  ];


  let rows =
    "";


  wantedStats.forEach(
    ([apiName, label]) => {

      const homeValue =
        homeStats.get(apiName);


      const awayValue =
        awayStats.get(apiName);


      if (
        homeValue === null &&
        awayValue === null
      ) {

        return;

      }


      const percentages =
        calculateBarPercentages(
          homeValue,
          awayValue
        );


      rows += `

        <div class="stat-row">

          <div class="stat-values">

            <span>
              ${escapeHTML(
                displayStat(homeValue)
              )}
            </span>

            <span class="stat-name">
              ${escapeHTML(label)}
            </span>

            <span>
              ${escapeHTML(
                displayStat(awayValue)
              )}
            </span>

          </div>


          <div class="stat-bars">

            <div class="stat-bar">

              <div
                style="width:${percentages.home}%"
              ></div>

            </div>


            <div class="stat-bar away">

              <div
                style="width:${percentages.away}%"
              ></div>

            </div>

          </div>

        </div>

      `;

    }
  );


  if (!rows) {

    matchContent.innerHTML =
      emptyContent(
        "No hay estadísticas disponibles."
      );

    return;

  }


  matchContent.innerHTML = `

    <div class="stats-card">

      <div
        class="stat-values"
        style="margin-bottom:20px"
      >

        <strong>
          ${escapeHTML(home.team.name)}
        </strong>

        <strong>
          ${escapeHTML(away.team.name)}
        </strong>

      </div>

      ${rows}

    </div>

  `;

}


function statsToMap(
  stats = []
) {

  const map =
    new Map();


  stats.forEach(
    item => {

      map.set(
        item.type,
        item.value
      );

    }
  );


  return map;

}


/* ==========================================================
   BARRAS
========================================================== */


function calculateBarPercentages(
  home,
  away
) {

  const h =
    parseStatNumber(home);


  const a =
    parseStatNumber(away);


  const total =
    h + a;


  if (!total) {

    return {
      home: 0,
      away: 0
    };

  }


  return {

    home:
      Math.round(
        (h / total) * 100
      ),

    away:
      Math.round(
        (a / total) * 100
      )

  };

}


function parseStatNumber(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return 0;

  }


  const number =
    parseFloat(
      String(value)
        .replace("%", "")
    );


  return (
    Number.isFinite(number)
      ? number
      : 0
  );

}


function displayStat(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "-";

  }


  return String(value);

}


/* ==========================================================
   ALINEACIONES
========================================================== */


async function loadLineups() {

  matchContent.innerHTML =
    loadingHTML();


  try {

    const data =
      await apiRequest(
        "fixtures/lineups",
        {
          fixture:
            selectedFixture.fixture.id
        }
      );


    renderLineups(
      data.response || []
    );

  } catch (error) {

    renderContentError(
      error
    );

  }

}


function renderLineups(
  lineups
) {

  if (!lineups.length) {

    matchContent.innerHTML =
      emptyContent(
        "Las alineaciones todavía no están disponibles."
      );

    return;

  }


  matchContent.innerHTML =
    lineups
      .map(
        lineup => {

          const starters =
            lineup.startXI || [];


          const substitutes =
            lineup.substitutes || [];


          return `

            <section class="lineup-team">

              <div class="lineup-title">

                <img
                  src="${escapeHTML(lineup.team.logo)}"
                  alt=""
                >

                <div>

                  <strong>
                    ${escapeHTML(lineup.team.name)}
                  </strong>

                  <small>

                    Formación:
                    ${escapeHTML(
                      lineup.formation ||
                      "No disponible"
                    )}

                    · DT:
                    ${escapeHTML(
                      lineup.coach?.name ||
                      "No disponible"
                    )}

                  </small>

                </div>

              </div>


              <span class="eyebrow">
                TITULARES
              </span>


              <div
                class="players-list"
                style="margin-top:10px"
              >

                ${starters
                  .map(
                    item =>
                      playerRow(
                        item.player
                      )
                  )
                  .join("")}

              </div>


              <span
                class="eyebrow"
                style="display:block;margin-top:20px"
              >
                BANCA
              </span>


              <div
                class="players-list"
                style="margin-top:10px"
              >

                ${substitutes
                  .map(
                    item =>
                      playerRow(
                        item.player
                      )
                  )
                  .join("")}

              </div>

            </section>

          `;

        }
      )
      .join("");

}


function playerRow(
  player
) {

  return `

    <div class="player-row">

      <span class="player-number">
        ${player.number ?? "-"}
      </span>

      <span>
        ${escapeHTML(
          player.name ||
          "Jugador"
        )}
      </span>

    </div>

  `;

}


/* ==========================================================
   ABRIR LIGA
========================================================== */


async function openLeague(
  leagueID
) {

  selectedLeague =
    LEAGUES.find(
      league =>
        league.id ===
        Number(leagueID)
    );


  if (!selectedLeague) {
    return;
  }


  showView(
    "leagueView"
  );


  await ensureLeagueMetadata(
    selectedLeague.id
  );


  const metadata =
    leagueMetadata.get(
      selectedLeague.id
    ) || {};


  document.getElementById(
    "leagueName"
  ).textContent =
    selectedLeague.name;


  document.getElementById(
    "leagueCountry"
  ).textContent =
    metadata.country ||
    selectedLeague.country;


  document.getElementById(
    "leagueSeason"
  ).textContent =
    metadata.season
      ? `Temporada ${metadata.season}`
      : "";


  const logo =
    document.getElementById(
      "leagueLogo"
    );


  if (metadata.logo) {

    logo.src =
      metadata.logo;

    logo.style.display =
      "block";

  }

  else {

    logo.removeAttribute(
      "src"
    );

    logo.style.display =
      "none";

  }


  setLeagueTabActive(
    "matches"
  );


  renderLeagueMatches();

}


/* ==========================================================
   METADATOS DE LIGA
========================================================== */


async function ensureLeagueMetadata(
  leagueID
) {

  if (
    leagueMetadata.has(
      leagueID
    )
  ) {

    return;

  }


  try {

    const data =
      await apiRequest(
        "leagues",
        {
          id:
            leagueID,

          current:
            "true"
        }
      );


    const item =
      data.response?.[0];


    if (!item) {
      return;
    }


    const currentSeason =
      item.seasons
        ?.find(
          season =>
            season.current
        );


    leagueMetadata.set(
      leagueID,
      {
        logo:
          item.league.logo,

        country:
          item.country?.name,

        season:
          currentSeason?.year
      }
    );

  } catch (error) {

    console.error(
      error
    );

  }

}


/* ==========================================================
   PARTIDOS DE UNA LIGA
========================================================== */


async function renderLeagueMatches() {

  leagueContent.innerHTML =
    loadingHTML();


  try {

    const metadata =
      leagueMetadata.get(
        selectedLeague.id
      );


    const params = {
      league:
        selectedLeague.id
    };


    if (
      metadata?.season
    ) {

      params.season =
        metadata.season;

    }


    params.next =
      15;


    const data =
      await apiRequest(
        "fixtures",
        params
      );


    const fixtures =
      data.response || [];


    if (!fixtures.length) {

      leagueContent.innerHTML =
        emptyContent(
          "No encontramos próximos partidos."
        );

      return;

    }


    const wrapper =
      document.createElement(
        "div"
      );


    wrapper.className =
      "league-group";


    fixtures.forEach(
      fixture => {

        wrapper.appendChild(
          createMatchCard(
            fixture
          )
        );

      }
    );


    leagueContent.innerHTML =
      "";


    leagueContent.appendChild(
      wrapper
    );

  } catch (error) {

    leagueContent.innerHTML =
      emptyContent(
        error.message
      );

  }

}


/* ==========================================================
   TABLA
========================================================== */


async function loadStandings() {

  leagueContent.innerHTML =
    loadingHTML();


  await ensureLeagueMetadata(
    selectedLeague.id
  );


  const metadata =
    leagueMetadata.get(
      selectedLeague.id
    );


  if (!metadata?.season) {

    leagueContent.innerHTML =
      emptyContent(
        "No encontramos una temporada activa para esta competición."
      );

    return;

  }


  try {

    const data =
      await apiRequest(
        "standings",
        {
          league:
            selectedLeague.id,

          season:
            metadata.season
        }
      );


    const groups =
      data.response?.[0]
        ?.league
        ?.standings;


    if (
      !groups ||
      !groups.length
    ) {

      leagueContent.innerHTML =
        emptyContent(
          "Esta competición no tiene una tabla disponible."
        );

      return;

    }


    /*
      Algunas copas tienen varios grupos.
    */


    leagueContent.innerHTML =
      groups
        .map(
          (table, index) => {

            return `

              ${
                groups.length > 1
                  ? `<h3 style="margin:18px 4px 10px">
                       Grupo ${index + 1}
                     </h3>`
                  : ""
              }


              <div class="standings-wrapper">

                <table class="standings">

                  <thead>

                    <tr>

                      <th>#</th>

                      <th
                        style="text-align:left"
                      >
                        Equipo
                      </th>

                      <th>PJ</th>
                      <th>G</th>
                      <th>E</th>
                      <th>P</th>
                      <th>GF</th>
                      <th>GC</th>
                      <th>DG</th>
                      <th>PTS</th>

                    </tr>

                  </thead>


                  <tbody>

                    ${table
                      .map(
                        team => `

                          <tr>

                            <td>
                              ${team.rank}
                            </td>


                            <td>

                              <div class="club">

                                <img
                                  src="${escapeHTML(team.team.logo)}"
                                  alt=""
                                >

                                <strong>
                                  ${escapeHTML(team.team.name)}
                                </strong>

                              </div>

                            </td>


                            <td>
                              ${team.all.played}
                            </td>

                            <td>
                              ${team.all.win}
                            </td>

                            <td>
                              ${team.all.draw}
                            </td>

                            <td>
                              ${team.all.lose}
                            </td>

                            <td>
                              ${team.all.goals.for}
                            </td>

                            <td>
                              ${team.all.goals.against}
                            </td>

                            <td>
                              ${team.goalsDiff}
                            </td>

                            <td>
                              <strong>
                                ${team.points}
                              </strong>
                            </td>

                          </tr>

                        `
                      )
                      .join("")}

                  </tbody>

                </table>

              </div>

            `;

          }
        )
        .join("");

  } catch (error) {

    leagueContent.innerHTML =
      emptyContent(
        error.message
      );

  }

}


/* ==========================================================
   GOLEADORES
========================================================== */


async function loadTopScorers() {

  leagueContent.innerHTML =
    loadingHTML();


  await ensureLeagueMetadata(
    selectedLeague.id
  );


  const metadata =
    leagueMetadata.get(
      selectedLeague.id
    );


  if (!metadata?.season) {

    leagueContent.innerHTML =
      emptyContent(
        "No encontramos una temporada activa."
      );

    return;

  }


  try {

    const data =
      await apiRequest(
        "players/topscorers",
        {
          league:
            selectedLeague.id,

          season:
            metadata.season
        }
      );


    const players =
      data.response || [];


    if (!players.length) {

      leagueContent.innerHTML =
        emptyContent(
          "No hay datos de goleadores disponibles."
        );

      return;

    }


    leagueContent.innerHTML =
      players
        .slice(0, 20)
        .map(
          (item, index) => {

            const statistics =
              item.statistics?.[0] || {};


            return `

              <div class="scorer-card">

                <span class="scorer-position">
                  ${index + 1}
                </span>


                <img
                  class="scorer-photo"
                  src="${escapeHTML(item.player.photo || "")}"
                  alt=""
                >


                <div class="scorer-info">

                  <strong>
                    ${escapeHTML(item.player.name)}
                  </strong>

                  <small>
                    ${escapeHTML(
                      statistics.team?.name ||
                      ""
                    )}
                  </small>

                </div>


                <span class="scorer-goals">
                  ${statistics.goals?.total ?? 0}
                </span>

              </div>

            `;

          }
        )
        .join("");

  } catch (error) {

    leagueContent.innerHTML =
      emptyContent(
        error.message
      );

  }

}


/* ==========================================================
   BUSCADOR DE LIGAS
========================================================== */


function normalizeText(
  text
) {

  return String(text || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();

}


function searchLeagues(
  query
) {

  const q =
    normalizeText(query);


  if (!q) {

    return [];

  }


  return LEAGUES.filter(
    league => {

      const values = [

        league.name,

        league.country,

        ...(league.aliases || [])

      ];


      return values.some(
        value =>
          normalizeText(value)
            .includes(q)
      );

    }
  );

}


function renderSearchResults(
  query
) {

  const results =
    searchLeagues(
      query
    );


  if (!query.trim()) {

    searchResults.classList.add(
      "hidden"
    );

    clearSearch.classList.add(
      "hidden"
    );

    return;

  }


  clearSearch.classList.remove(
    "hidden"
  );


  searchResults.classList.remove(
    "hidden"
  );


  if (!results.length) {

    searchResults.innerHTML = `

      <div
        style="
          padding:18px;
          color:#8d96a8;
          font-size:13px;
        "
      >
        No encontramos esa liga.
      </div>

    `;

    return;

  }


  searchResults.innerHTML =
    results
      .map(
        league => {

          const metadata =
            leagueMetadata.get(
              league.id
            );


          return `

            <button
              class="search-result"
              data-league="${league.id}"
            >

              ${
                metadata?.logo

                  ? `<img
                       src="${escapeHTML(metadata.logo)}"
                       alt=""
                     >`

                  : `<div
                       style="
                         width:36px;
                         height:36px;
                         display:grid;
                         place-items:center;
                         font-size:20px;
                       "
                     >
                       🏆
                     </div>`
              }


              <div>

                <strong>
                  ${escapeHTML(league.name)}
                </strong>

                <small>
                  ${escapeHTML(league.country)}
                </small>

              </div>

            </button>

          `;

        }
      )
      .join("");


  searchResults
    .querySelectorAll(
      "[data-league]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              Number(
                button.dataset.league
              );


            leagueSearch.value =
              "";


            searchResults
              .classList
              .add("hidden");


            clearSearch
              .classList
              .add("hidden");


            openLeague(id);

          }
        );

      }
    );

}


/* ==========================================================
   RENDER 30 LIGAS
========================================================== */


function renderLeagueGrid() {

  leaguesGrid.innerHTML =
    LEAGUES
      .map(
        league => {

          const metadata =
            leagueMetadata.get(
              league.id
            );


          return `

            <button
              class="league-card"
              data-league="${league.id}"
            >

              ${
                metadata?.logo

                  ? `<img
                       src="${escapeHTML(metadata.logo)}"
                       alt=""
                     >`

                  : `<div
                       style="
                         font-size:34px;
                         margin-bottom:14px;
                       "
                     >
                       🏆
                     </div>`
              }


              <strong>
                ${escapeHTML(league.name)}
              </strong>


              <small>
                ${escapeHTML(league.country)}
              </small>

            </button>

          `;

        }
      )
      .join("");


  leaguesGrid
    .querySelectorAll(
      "[data-league]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () =>
            openLeague(
              Number(
                button.dataset.league
              )
            )
        );

      }
    );

}


/* ==========================================================
   FAVORITOS
========================================================== */


function loadFavorites() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "footballFavorites"
      )
    ) || [];

  } catch {

    return [];

  }

}


function saveFavorites() {

  localStorage.setItem(
    "footballFavorites",
    JSON.stringify(
      favorites
    )
  );

}


function toggleFavorite(
  fixtureID
) {

  const index =
    favorites.indexOf(
      fixtureID
    );


  if (index >= 0) {

    favorites.splice(
      index,
      1
    );

  }

  else {

    favorites.push(
      fixtureID
    );

  }


  saveFavorites();

}


function renderFavorites() {

  const container =
    document.getElementById(
      "favoritesContainer"
    );


  const fixtures =
    currentFixtures.filter(
      fixture =>
        favorites.includes(
          fixture.fixture.id
        )
    );


  if (!fixtures.length) {

    container.innerHTML =
      emptyContent(
        "Marcá partidos con ★ y aparecerán aquí."
      );

    return;

  }


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "league-group";


  fixtures.forEach(
    fixture => {

      wrapper.appendChild(
        createMatchCard(
          fixture
        )
      );

    }
  );


  container.innerHTML =
    "";


  container.appendChild(
    wrapper
  );

}


/* ==========================================================
   VISTAS
========================================================== */


function showView(
  id
) {

  document
    .querySelectorAll(
      ".view"
    )
    .forEach(
      view =>
        view.classList.remove(
          "active-view"
        )
    );


  document
    .getElementById(id)
    .classList
    .add(
      "active-view"
    );


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ==========================================================
   TABS PARTIDO
========================================================== */


function setMatchTabActive(
  tab
) {

  document
    .querySelectorAll(
      ".match-tab"
    )
    .forEach(
      button =>
        button.classList.toggle(
          "active",
          button.dataset.matchTab ===
            tab
        )
    );

}


/* ==========================================================
   TABS LIGA
========================================================== */


function setLeagueTabActive(
  tab
) {

  document
    .querySelectorAll(
      ".tab-button"
    )
    .forEach(
      button =>
        button.classList.toggle(
          "active",
          button.dataset.leagueTab ===
            tab
        )
    );

}


/* ==========================================================
   UI HELPERS
========================================================== */


function showLoading() {

  loading.classList.remove(
    "hidden"
  );


  errorBox.classList.add(
    "hidden"
  );


  emptyBox.classList.add(
    "hidden"
  );


  matchesContainer.innerHTML =
    "";

}


function hideMessages() {

  loading.classList.add(
    "hidden"
  );


  errorBox.classList.add(
    "hidden"
  );


  emptyBox.classList.add(
    "hidden"
  );

}


function showError(
  message
) {

  loading.classList.add(
    "hidden"
  );


  emptyBox.classList.add(
    "hidden"
  );


  errorMessage.textContent =
    message;


  errorBox.classList.remove(
    "hidden"
  );


  matchesContainer.innerHTML =
    "";

}


function loadingHTML() {

  return `

    <div class="loading">

      <div class="spinner"></div>

      <p>Cargando...</p>

    </div>

  `;

}


function emptyContent(
  message
) {

  return `

    <div class="message-box">

      <span>⚽</span>

      <div>

        <strong>
          Información no disponible
        </strong>

        <p>
          ${escapeHTML(message)}
        </p>

      </div>

    </div>

  `;

}


function renderContentError(
  error
) {

  matchContent.innerHTML =
    emptyContent(
      error.message
    );

}


/* ==========================================================
   FORMATO
========================================================== */


function formatKickoff(
  date
) {

  try {

    return new Date(date)
      .toLocaleTimeString(
        "es-ES",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  } catch {

    return "--:--";

  }

}


/* ==========================================================
   SEGURIDAD HTML
========================================================== */


function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* ==========================================================
   EVENTOS DEL BUSCADOR
========================================================== */


leagueSearch.addEventListener(
  "input",
  event => {

    renderSearchResults(
      event.target.value
    );

  }
);


clearSearch.addEventListener(
  "click",
  () => {

    leagueSearch.value =
      "";


    searchResults.classList.add(
      "hidden"
    );


    clearSearch.classList.add(
      "hidden"
    );


    leagueSearch.focus();

  }
);


document.addEventListener(
  "click",
  event => {

    if (
      !event.target.closest(
        ".search-section"
      )
    ) {

      searchResults
        .classList
        .add("hidden");

    }

  }
);


/* ==========================================================
   FECHAS
========================================================== */


document
  .getElementById(
    "previousDay"
  )
  .addEventListener(
    "click",
    () => {

      selectedDate.setDate(
        selectedDate.getDate() - 1
      );


      selectedDate =
        new Date(
          selectedDate
        );


      updateDateUI();

      loadFixtures();

    }
  );


document
  .getElementById(
    "nextDay"
  )
  .addEventListener(
    "click",
    () => {

      selectedDate.setDate(
        selectedDate.getDate() + 1
      );


      selectedDate =
        new Date(
          selectedDate
        );


      updateDateUI();

      loadFixtures();

    }
  );


/* ==========================================================
   FILTROS
========================================================== */


document
  .querySelectorAll(
    ".filter-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".filter-button"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          currentFilter =
            button.dataset.filter;


          renderFixtures();

        }
      );

    }
  );


/* ==========================================================
   REFRESH
========================================================== */


document
  .getElementById(
    "refreshButton"
  )
  .addEventListener(
    "click",
    () => {

      loadFixtures();

    }
  );


/* ==========================================================
   MATCH TABS
========================================================== */


document
  .querySelectorAll(
    ".match-tab"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        async () => {

          const tab =
            button.dataset.matchTab;


          setMatchTabActive(
            tab
          );


          if (
            tab === "summary"
          ) {

            await loadMatchSummary();

          }


          if (
            tab === "stats"
          ) {

            await loadStatistics();

          }


          if (
            tab === "lineups"
          ) {

            await loadLineups();

          }


          if (
            tab === "events"
          ) {

            await loadEvents();

          }

        }
      );

    }
  );


/* ==========================================================
   LEAGUE TABS
========================================================== */


document
  .querySelectorAll(
    ".tab-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        async () => {

          const tab =
            button.dataset.leagueTab;


          setLeagueTabActive(
            tab
          );


          if (
            tab === "matches"
          ) {

            await renderLeagueMatches();

          }


          if (
            tab === "standings"
          ) {

            await loadStandings();

          }


          if (
            tab === "scorers"
          ) {

            await loadTopScorers();

          }

        }
      );

    }
  );


/* ==========================================================
   VOLVER
========================================================== */


document
  .getElementById(
    "backFromMatch"
  )
  .addEventListener(
    "click",
    () => {

      showView(
        "homeView"
      );

    }
  );


document
  .getElementById(
    "backFromLeague"
  )
  .addEventListener(
    "click",
    () => {

      showView(
        "homeView"
      );

    }
  );


/* ==========================================================
   NAVEGACIÓN INFERIOR
========================================================== */


document
  .querySelectorAll(
    ".nav-button"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".nav-button"
            )
            .forEach(
              item =>
                item.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          if (
            button.dataset.action ===
            "live"
          ) {

            showView(
              "homeView"
            );


            currentFilter =
              "live";


            document
              .querySelectorAll(
                ".filter-button"
              )
              .forEach(
                filter => {

                  filter.classList.toggle(
                    "active",
                    filter.dataset.filter ===
                      "live"
                  );

                }
              );


            renderFixtures();

            return;

          }


          const view =
            button.dataset.view;


          if (!view) {
            return;
          }


          showView(view);


          if (
            view ===
            "leaguesView"
          ) {

            renderLeagueGrid();

          }


          if (
            view ===
            "favoritesView"
          ) {

            renderFavorites();

          }

        }
      );

    }
  );


/* ==========================================================
   INICIAR
========================================================== */


async function init() {

  updateDateUI();

  renderLeagueGrid();

  await loadFixtures();


  /*
    Actualización automática SOLO mientras la página
    esté abierta.

    No hacemos consultas cada pocos segundos porque
    gastaríamos demasiado rápido el límite gratuito.

    Cada 2 minutos comprobamos si actualmente
    hay partidos en vivo.
  */


  setInterval(
    () => {

      const hasLive =
        currentFixtures.some(
          fixture =>
            fixtureCategory(
              fixture
            ) === "live"
        );


      if (
        hasLive &&
        !document.hidden
      ) {

        loadFixtures();

      }

    },

    120000
  );

}


init();
