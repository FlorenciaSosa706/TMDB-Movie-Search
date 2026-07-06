const API_KEY = "f3f7df721367d506a6c06987da8478aa";
const BASE_URL = "https://api.themoviedb.org/3";

let currentQuery = "";
let currentPage = 1;
let totalPages = 1;
let currentSection = "home"; // sección activa del nav

// ── Navbar: dropdown de perfil ────────────────────────────────
const profileBtn = document.getElementById("profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");

profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = profileDropdown.classList.toggle("open");
  profileBtn.setAttribute("aria-expanded", isOpen);
});

// Cerrar dropdown al hacer clic fuera
document.addEventListener("click", () => {
  profileDropdown.classList.remove("open");
  profileBtn.setAttribute("aria-expanded", "false");
});

// ── Navbar: links de sección ──────────────────────────────────
const sectionEndpoints = {
  home: null,                      // solo muestra la búsqueda vacía
  popular: "/movie/popular",
  top_rated: "/movie/top_rated",
  upcoming: "/movie/upcoming",
};

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const section = link.dataset.section;

    // Marcar activo
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    currentSection = section;
    currentQuery = "";
    currentPage = 1;
    document.getElementById("search-input").value = "";

    if (section === "home") {
      // Volver a home: limpiar resultados y ocultar filtros
      document.getElementById("results").innerHTML = "";
      document.getElementById("filter-bar").classList.add("hidden");
      document.getElementById("pagination").classList.add("hidden");    // ocultar paginación
      document.getElementById("home-greeting").classList.remove("hidden"); // mostrar saludo
    } else {
      document.getElementById("home-greeting").classList.add("hidden"); // ocultar saludo
      loadSection(section);
    }
  });
});

async function loadSection(section) {
  const endpoint = sectionEndpoints[section];
  if (!endpoint) return;

  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES&page=${currentPage}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la API");
    const data = await response.json();
    totalPages = data.total_pages;
    renderResults(data.results);
    updatePaginationUI();
    showFilterBar();
  } catch (error) {
    console.error("Error al cargar sección:", error);
    document.getElementById("results").innerHTML = "<p>Ocurrió un error. Probá de nuevo.</p>";
  }
}



// ── Poblar el select de años (2024 → 1950) ──────────────────
const yearSelect = document.getElementById("year-select");
const currentYear = new Date().getFullYear();
for (let y = currentYear; y >= 1950; y--) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

// ── Helpers para leer los filtros activos ────────────────────
function getFilters() {
  return {
    sort: document.getElementById("sort-select").value,
    genre: document.getElementById("genre-select").value,
    year: document.getElementById("year-select").value,
  };
}

function showFilterBar() {
  document.getElementById("filter-bar").classList.remove("hidden");
}

// ── Fetch principal ──────────────────────────────────────────
async function searchMovies(query, page) {
  const { sort, genre, year } = getFilters();

  let url;

  if (query) {
    // Búsqueda por texto — la API de search no soporta sort_by,
    // así que usamos discover con el texto como filtro de keyword
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}`
      + `&query=${encodeURIComponent(query)}`
      + `&page=${page}`
      + `&language=es-ES`
      + (genre ? `&with_genres=${genre}` : "")
      + (year ? `&primary_release_year=${year}` : "");
  } else {
    // Sin búsqueda → discover (soporta todos los filtros)
    url = `${BASE_URL}/discover/movie?api_key=${API_KEY}`
      + `&page=${page}`
      + `&language=es-ES`
      + `&sort_by=${sort}`
      + (genre ? `&with_genres=${genre}` : "")
      + (year ? `&primary_release_year=${year}` : "");
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la respuesta de la API");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al buscar películas:", error);
    document.getElementById("results").innerHTML = "<p>Ocurrió un error. Probá de nuevo.</p>";
  }
}

function renderResults(movies) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  if (!movies || movies.length === 0) {
    container.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  movies.forEach(movie => {
    const posterHTML = movie.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w342${movie.poster_path}" alt="${movie.title}" />`
      : `<div class="no-poster">🎬<span>Sin poster</span></div>`;

    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      ${posterHTML}
      <h3>${movie.title}</h3>
    `;
    card.addEventListener("click", () => openModal(movie.id));
    container.appendChild(card);
  });
}

function updatePaginationUI() {
  document.getElementById("page-info").textContent = `Página ${currentPage} de ${totalPages}`;
  document.getElementById("prev-btn").disabled = currentPage <= 1;
  document.getElementById("next-btn").disabled = currentPage >= totalPages;
  document.getElementById("pagination").classList.remove("hidden"); // mostrar al tener resultados
}

async function loadResults() {
  const data = await searchMovies(currentQuery, currentPage);
  if (!data) return;

  totalPages = data.total_pages;
  renderResults(data.results);
  updatePaginationUI();
  showFilterBar();
}

// ── Eventos de búsqueda ──────────────────────────────────────
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  currentQuery = document.getElementById("search-input").value.trim();
  currentPage = 1;
  if (currentQuery) {
    document.getElementById("home-greeting").classList.add("hidden"); // ocultar saludo al buscar
  }
  loadResults();
});

// ── Eventos de filtros (se aplican automáticamente) ──────────
["sort-select", "genre-select", "year-select"].forEach(id => {
  document.getElementById(id).addEventListener("change", () => {
    currentPage = 1;
    loadResults();
  });
});

// ── Botón limpiar filtros ────────────────────────────────────
document.getElementById("clear-filters").addEventListener("click", () => {
  document.getElementById("sort-select").value = "popularity.desc";
  document.getElementById("genre-select").value = "";
  document.getElementById("year-select").value = "";
  currentPage = 1;
  loadResults();
});

// ── Paginación ───────────────────────────────────────────────
document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPage > 1) { currentPage--; loadResults(); }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentPage < totalPages) { currentPage++; loadResults(); }
});

// ── Modal de detalle ─────────────────────────────────────────
const modal        = document.getElementById("movie-modal");
const modalBody    = modal.querySelector(".modal-body");
const modalLoading = document.getElementById("modal-loading");

function openModal(movieId) {
  // Mostrar modal con spinner mientras carga
  modal.classList.remove("hidden");
  modalBody.classList.add("hidden");
  modalLoading.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // bloquea scroll de fondo

  fetchMovieDetail(movieId);
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

async function fetchMovieDetail(movieId) {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`;
    const res  = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener detalle");
    const data = await res.json();
    fillModal(data);
  } catch (err) {
    console.error(err);
    modalLoading.innerHTML = "<p>Error al cargar los datos.</p>";
  }
}

function fillModal(movie) {
  // Poster
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=Sin+poster";
  document.getElementById("modal-poster").src = poster;
  document.getElementById("modal-poster").alt = movie.title;

  // Título
  document.getElementById("modal-title").textContent = movie.title;

  // Géneros como chips
  const genresEl = document.getElementById("modal-genres");
  genresEl.innerHTML = movie.genres
    .map(g => `<span class="genre-chip">${g.name}</span>`)
    .join("");

  // Meta: año, duración, rating
  const year     = movie.release_date ? movie.release_date.slice(0, 4) : "–";
  const runtime  = movie.runtime ? `${movie.runtime} min` : "–";
  const rating   = movie.vote_average ? movie.vote_average.toFixed(1) : "–";
  document.getElementById("modal-meta").innerHTML = `
    <span>📅 ${year}</span>
    <span>⏱ ${runtime}</span>
    <span>⭐ ${rating} / 10</span>
    <span>🗳 ${movie.vote_count.toLocaleString()} votos</span>
  `;

  // Sinopsis
  document.getElementById("modal-overview").textContent =
    movie.overview || "Sin sinopsis disponible.";

  // Reparto (primeros 5)
  const cast = movie.credits?.cast?.slice(0, 5).map(p => p.name).join(", ") || "";
  document.getElementById("modal-extra").innerHTML = cast
    ? `<span>🎭 <strong>Reparto:</strong> ${cast}</span>`
    : "";

  // Mostrar contenido, ocultar spinner
  modalLoading.classList.add("hidden");
  modalBody.classList.remove("hidden");
}

// Cerrar con botón ✕
document.getElementById("modal-close").addEventListener("click", closeModal);

// Cerrar al hacer clic en el backdrop (fuera del contenido)
document.getElementById("modal-backdrop").addEventListener("click", closeModal);

// Cerrar con tecla Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// ── Panel lateral de perfil ───────────────────────────────────
const profilePanel        = document.getElementById("profile-panel");
const profilePanelBackdrop = document.getElementById("profile-panel-backdrop");
const profilePanelClose   = document.getElementById("profile-panel-close");

function openProfilePanel(section) {
  // Ocultar todas las secciones del panel
  document.querySelectorAll(".panel-section").forEach(s => s.classList.add("hidden"));
  // Mostrar la sección solicitada
  const target = document.getElementById(`panel-${section}`);
  if (target) target.classList.remove("hidden");
  // Mostrar el panel y bloquear scroll
  profilePanel.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProfilePanel() {
  profilePanel.classList.add("hidden");
  document.body.style.overflow = "";
}

// Botón ✕ y backdrop
profilePanelClose.addEventListener("click", closeProfilePanel);
profilePanelBackdrop.addEventListener("click", closeProfilePanel);

// Cerrar con Escape (compartido con el modal)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProfilePanel();
});

// Conectar items del dropdown con data-panel
document.querySelectorAll("[data-panel]").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const section = item.dataset.panel;
    // Cerrar dropdown antes de abrir el panel
    profileDropdown.classList.remove("open");
    profileBtn.setAttribute("aria-expanded", "false");
    openProfilePanel(section);
  });
});
