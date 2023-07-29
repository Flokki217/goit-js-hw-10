import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchBreeds, fetchCatByBreed, API_KEY } from './cat-api';
axios.defaults.headers.common['x-api-key'] = API_KEY;

const selectorEl = document.querySelector('.breed-select');
const catInfoEl = document.querySelector('.cat-info');
const loaderEl = document.querySelector('.loader');
function getLoader() {
  loaderEl.classList.toggle('is-hidden');
}
getLoader();
fetchBreeds()
  .then(data => {
    createOptions(data);
    getLoader();
  })
  .catch(() =>
    console.warn('Sorry, something went wrong. Reload the page and try again')
  );

selectorEl.addEventListener('change', evt => {
  getLoader();
  fetchCatByBreed(evt.currentTarget.value)
    .then(data => {
      renderMarkup(data);
      getLoader();
      Notify.success('Take a look for this cutie-pie');
    })
    .catch(() => {
      Notify.failure('Sorry, we cannot find information about this cat');
    });
});

function renderMarkup(response) {
  const markup = response.data.map(info => {
    const { name, temperament, description } = info.breeds[0];
    return `<img src="${info.url}"/><div class="descr"><h3>${name}</h3><p>${description}</p><p>Temperament: ${temperament}</p></div>`;
  });

  catInfoEl.innerHTML = markup;
}

function createOptions(response) {
  const options = response.data
    .map(cat => {
      return `<option value="${cat.id}">${cat.name}</option>`;
    })
    .join('');

  selectorEl.innerHTML += options;
}
getLoader();
