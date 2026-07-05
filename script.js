const API_KEY = "f3f7df721367d506a6c06987da8478aa";
const BASE_URL = "https://api.themoviedb.org/3";

let currentQuery = "";
let currentPage = 1;
let totalPages = 1;


async function searchMovies(query, page) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=es-ES`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Error en la respuesta de la API");
    
    const data = await response.json();
    return data; // trae { results, page, total_pages, total_results }
  } catch (error) {
    console.error("Error al buscar películas:", error);
    document.getElementById("results").innerHTML = "<p>Ocurrió un error. Probá de nuevo.</p>";
  }
}

function renderResults(movies) {
  const container = document.getElementById("results");
  container.innerHTML = ""; // limpiamos resultados anteriores

  if (movies.length === 0) {
    container.innerHTML = "<p>No se encontraron resultados.</p>";
    return;
  }

  movies.forEach(movie => {
    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : "https://via.placeholder.com/342x513?text=Sin+poster";

    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${posterPath}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average.toFixed(1)} / 10</p>
      <p>${movie.release_date ? movie.release_date.slice(0, 4) : "Sin fecha"}</p>
    `;
    container.appendChild(card);
  });
}


function updatePaginationUI() {
  document.getElementById("page-info").textContent = `Página ${currentPage} de ${totalPages}`;
  document.getElementById("prev-btn").disabled = currentPage <= 1;
  document.getElementById("next-btn").disabled = currentPage >= totalPages;
}

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadResults();
  }
});

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadResults();
  }
});


async function loadResults() {
  const data = await searchMovies(currentQuery, currentPage);
  if (!data) return;

  totalPages = data.total_pages;
  renderResults(data.results);
  updatePaginationUI();
}

document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault(); // evita que el form recargue la página
  currentQuery = document.getElementById("search-input").value.trim();
  currentPage = 1; // toda búsqueda nueva arranca en página 1
  if (currentQuery) loadResults();
});

