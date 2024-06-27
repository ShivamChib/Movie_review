const API_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=';
const GENRE_API = 'https://api.themoviedb.org/3/genre/movie/list?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US';
const DISCOVER_GENRE_API = 'https://api.themoviedb.org/3/discover/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&with_genres=';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const modeToggle = document.getElementById('mode-toggle');
const homeButton = document.getElementById('home');
const yearFilterButton = document.getElementById('filter-year');
const ratingFilterButton = document.getElementById('filter-rating');
const genreNav = document.getElementById('genre-nav');

getMovies(API_URL);

async function fetchGenres() {
    try {
        const res = await fetch(GENRE_API);
        const data = await res.json();
        const genres = data.genres;
        genres.forEach(genre => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = genre.name;
            button.classList.add('genre-btn');
            button.dataset.genreId = genre.id;
            li.appendChild(button);
            genreNav.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}


async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        showMovies(data.results);
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function showMovies(movies) {
    main.innerHTML = '';

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">
                    ${vote_average}
                </span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <p>${overview}</p>
            </div>
        `;
        main.appendChild(movieEl);

       
        movieEl.addEventListener('mouseenter', () => {
            movieEl.querySelector('.overview').style.transform = 'translateY(0)';
            movieEl.querySelector('.overview').style.opacity = '1';
        });

        movieEl.addEventListener('mouseleave', () => {
            movieEl.querySelector('.overview').style.transform = 'translateY(100%)';
            movieEl.querySelector('.overview').style.opacity = '0';
        });
    });
}


function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green';
    } else if (vote >= 5) {
        return 'orange';
    } else {
        return 'red';
    }
}


form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if (searchTerm && searchTerm !== '') {
        const url = SEARCH_API + searchTerm;
        try {
            const res = await fetch(url);
            const data = await res.json();
            showMovies(data.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        search.value = '';
    } else {
        getMovies(API_URL);
    }
});

modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        modeToggle.textContent = 'Dark Mode';
    } else {
        modeToggle.textContent = 'Light Mode';
    }
});


homeButton.addEventListener('click', () => {
    getMovies(API_URL);
});

yearFilterButton.addEventListener('click', () => {
    const year = prompt('Enter the year:');
    if (year) {
        const URL = `https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c`;
        getMovies(URL);
    }
});


ratingFilterButton.addEventListener('click', () => {
    const rating = prompt('Enter the minimum rating (0-10):');
    if (rating) {
        const URL = `https://api.themoviedb.org/3/discover/movie?vote_average.gte=${rating}&sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c`;
        getMovies(URL);
    }
});

document.getElementById('filter-genre').addEventListener('click', async () => {
    try {
        const res = await fetch(GENRE_API);
        const data = await res.json();
        const genres = data.genres;
        let genreOptions = 'Choose a genre:\n';
        genres.forEach(genre => {
            genreOptions += `${genre.id}: ${genre.name}\n`;
        });
        const genreId = prompt(genreOptions);
        if (genreId) {
            const url = DISCOVER_GENRE_API + genreId;
            const res = await fetch(url);
            const data = await res.json();
            showMovies(data.results);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});