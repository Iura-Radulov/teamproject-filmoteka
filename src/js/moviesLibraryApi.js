import { getDatabase, ref, set, child, get } from 'firebase/database';
import { app } from './firebase/firebase';
import { Notify } from 'notiflix';

const database = getDatabase(app);

const showWatchedBtn = document.getElementById('watched');
const showQueueBtn = document.getElementById('queue');
const showLibraryBtn = document.getElementById('library');
const showHomeBtn = document.getElementById('home');
const search = document.querySelector('.search-wrapper');
const container = document.querySelector('.films__container');
const libraryButtons = document.querySelector('.buttons');

const WATCHED_MOVIES = 'watchedMovies/';
const MOVIES_QUEUE = 'queueOfMovies/';
const IS_HIDDEN = 'is-hidden';
const CURRENT_LINK = 'current-link';

showWatchedBtn.addEventListener('click', onWatchedBtnClick);
showQueueBtn.addEventListener('click', onQueueBtnClick);
showLibraryBtn.addEventListener('click', onLibraryBtnClick);
showHomeBtn.addEventListener('click', onHomeBtnClick);

function onHomeBtnClick() {
  libraryButtons.classList.add(IS_HIDDEN);
  search.classList.remove(IS_HIDDEN);
}

async function onLibraryBtnClick() {
  showLibraryBtn.classList.add(CURRENT_LINK);
  showHomeBtn.classList.remove(CURRENT_LINK);
  libraryButtons.classList.remove(IS_HIDDEN);
  search.classList.add(IS_HIDDEN);

  const response = await fetchMoviesFromDatabase(WATCHED_MOVIES);
  showLibrary(response);
}

async function onWatchedBtnClick() {
  const response = await fetchMoviesFromDatabase(WATCHED_MOVIES);
  const arrayOfJsons = Object.values(response);
  renderWatched(arrayOfJsons);
}

async function onQueueBtnClick() {
  const response = await fetchMoviesFromDatabase(MOVIES_QUEUE);
  const arrayOfJsons = Object.values(response);
  renderQueue(arrayOfJsons);
}

function onAddButtonClick(event) {
  const movieJson = event.target.dataset.movie;
  const id = Number(event.target.dataset.id);
  switch (event.target.id) {
    case 'add-to-watched':
      set(ref(database, `watchedMovies/${id}`), movieJson);

      removeBtnDataAttributes(event.target);
      break;

    case 'add-to-queue':
      set(ref(database, `queueOfMovies/${id}`), movieJson);

      removeBtnDataAttributes(event.target);
      break;

    default:
      break;
  }
}

export function createButtonRefs() {
  const addToWatchedBtn = document.getElementById('add-to-watched');
  const addToQueueBtn = document.getElementById('add-to-queue');
  return { addToWatchedBtn, addToQueueBtn };
}

export function addBtnEventListeners(buttons) {
  const { addToWatchedBtn, addToQueueBtn } = buttons;
  addToWatchedBtn.addEventListener('click', onAddButtonClick);
  addToQueueBtn.addEventListener('click', onAddButtonClick);
}

export function addBtnDataAttributes(movie, buttons) {
  const { addToWatchedBtn, addToQueueBtn } = buttons;
  addToWatchedBtn.setAttribute('data-movie', JSON.stringify(movie));
  addToQueueBtn.setAttribute('data-movie', JSON.stringify(movie));
  addToWatchedBtn.setAttribute('data-id', movie.id);
  addToQueueBtn.setAttribute('data-id', movie.id);
}

function removeBtnDataAttributes(button) {
  button.removeAttribute('data-movie');
  button.removeAttribute('data-movie');
}

function showLibrary(response) {
  const arrayOfJsons = Object.values(response);
  renderWatched(arrayOfJsons);
}

function fetchMoviesFromDatabase(category) {
  const dbRef = ref(database);
  return get(child(dbRef, category)).then(snapshot => {
    if (snapshot.exists()) {
      const response = snapshot.val();
      return response;
    } else {
      Notify.failure('Your library is empty');
    }
  });
}

function renderWatched(arrayOfJsons) {
  container.innerHTML = '';

  const markup = arrayOfJsons
    .map(json => JSON.parse(json))
    .map(
      ({
        poster_path,
        original_title,
        original_name,
        genres,
        release_date,
        id,
        vote_average,
      }) => `<div class="film-card">
        <img src="https://image.tmdb.org/t/p/w500${poster_path}"  alt="" width="310" loading="lazy" data-id=${id} />
        <div class="info">
          <p class="film__info-name">${
            original_title ? original_title : original_name
          }
          </p>
          <p class="info-item">
            <b>${
              genres.length > 2
                ? genres
                    .map(genre => genre.name)
                    .slice(0, 2)
                    .concat([' Other'])
                : genres.map(genre => genre.name)
            }</b >
            <b>|</b>
            <b>${release_date ? release_date.slice(0, 4) : '-'}</b>
            <b class="rating">${vote_average}</b>
          </p>
        </div>
      </div>`
    )
    .join('');

  container.insertAdjacentHTML('beforeend', markup);
}

function renderQueue(arrayOfJsons) {
  container.innerHTML = '';

  const markup = arrayOfJsons
    .map(json => JSON.parse(json))
    .map(
      ({
        poster_path,
        original_title,
        original_name,
        genres,
        release_date,
        id,
        vote_average,
      }) => `<div class="film-card">
        <img src="https://image.tmdb.org/t/p/w500${poster_path}"  alt="" width="310" loading="lazy" data-id=${id} />
        <div class="info">
          <p class="film__info-name">${
            original_title ? original_title : original_name
          }
          </p>
          <p class="info-item">
            <b>${
              genres.length > 2
                ? genres
                    .map(genre => genre.name)
                    .slice(0, 2)
                    .concat([' Other'])
                : genres.map(genre => genre.name)
            }</b >
            <b>|</b>
            <b>${release_date ? release_date.slice(0, 4) : '-'}</b>
            <b class="rating">${vote_average}</b>
          </p>
        </div>
      </div>`
    );

  container.insertAdjacentHTML('beforeend', markup);
}