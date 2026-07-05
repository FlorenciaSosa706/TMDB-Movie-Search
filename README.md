# TMDB-Movie-Search
Buscador de películas en tiempo real con paginación, pósteres y calificaciones, construido con JavaScript vanilla y la API de TMDB..
# 🎬 TMDB Movie Search

Buscador de películas en tiempo real construido con HTML, CSS y JavaScript vanilla, consumiendo la API pública de [The Movie Database (TMDB)](https://www.themoviedb.org/).

![Demo del proyecto](./screenshot-1.png)

## 🔗 Demo en vivo

[Ver proyecto funcionando](https://tu-usuario.github.io/tmdb-movie-search)

## ✨ Funcionalidades

- 🔍 Búsqueda de películas por título
- 📄 Paginación de resultados
- 🖼️ Visualización de pósteres, calificación y año de estreno
- 🎥 Modal de detalle con sinopsis, reparto y tráiler
- 📊 Gráfico de calificación promedio por año de los resultados
- 📁 Exportación de resultados a CSV
- ⚡ Manejo de estados de carga y error

## 🛠️ Tecnologías

- HTML5 / CSS3
- JavaScript (ES6+, `fetch`, `async/await`)
- [Chart.js](https://www.chartjs.org/) para las visualizaciones
- API de [TMDB](https://developer.themoviedb.org/docs)

## 📸 Capturas

| Búsqueda | Detalle de película |
|---|---|
| ![Búsqueda](./screenshot-1.png) | ![Detalle](./screenshot-2.png) |

## 🚀 Cómo correrlo localmente

1. Cloná el repositorio
   ```bash
   git clone https://github.com/tu-usuario/tmdb-movie-search.git
   cd tmdb-movie-search
   ```

2. Conseguí tu propia API Key gratuita en [TMDB](https://www.themoviedb.org/settings/api)

3. Creá un archivo `config.js` en la raíz del proyecto (este archivo está en `.gitignore`, no se sube al repo):
   ```js
   const API_KEY = "TU_API_KEY_ACA";
   ```

4. Abrí `index.html` en tu navegador (o usá una extensión como Live Server en VS Code)

## 🧠 Qué aprendí con este proyecto

- Consumo de APIs REST y manejo de paginación
- Renderizado dinámico del DOM a partir de datos remotos
- Manejo de estados de carga y error en aplicaciones sin frameworks
- Visualización de datos con Chart.js
- Buenas prácticas para no exponer API keys en repositorios públicos

## 📌 Notas

- La API key usada en este proyecto se maneja del lado del cliente porque TMDB lo permite para uso de solo lectura sin datos sensibles. En un proyecto de producción con datos privados, esto se manejaría desde un backend.
- Límite de la API: ~40 solicitudes por segundo (más que suficiente para este caso de uso).

## 📄 Atribución

Este producto usa la API de TMDB pero no está avalado ni certificado por TMDB.

![TMDB Logo](https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg)
