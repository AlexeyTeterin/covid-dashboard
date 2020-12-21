import { getSummary } from './CovidData.js';
import Keyboard from './keyboard.js';

const searchInput = document.querySelector('#list__search');
export const indicator = document.querySelector('#list__indicator');
export const list = document.querySelector('.list__container');
const keyboardButton = document.querySelector('.keyboard-button');

const keyboard = new Keyboard();
keyboard.init();

const createOptions = (data) => {
  const options = Object.keys(data.Global);
  options.forEach((opt) => options.push(`${opt}Per100k`));
  return options;
};

const calcValuesPer100k = (data, country) => {
  const result = {};
  Object.keys(data.Global).forEach((opt) => {
    const population = country.Premium.CountryStats.Population;
    let valuePer100k = ((country[opt] / population) * 100000);
    if (Number.isNaN(valuePer100k)) valuePer100k = 0;
    result[`${opt}Per100k`] = valuePer100k.toFixed(2);
  });
  return result;
};

const loadRows = (data, option) => {
  data.Countries.forEach((country) => {
    const row = document.createElement('div');
    const name = document.createElement('div');
    const value = document.createElement('div');
    const population = { population: country.Premium.CountryStats.Population };

    row.classList.add('list__row');

    name.textContent = country.Country;
    name.style.setProperty('background-image', `url(https://www.countryflags.io/${country.CountryCode}/shiny/24.png)`);

    value.textContent = country[option];

    Object.assign(row.dataset, country, calcValuesPer100k(data, country), population);
    ['Slug', 'Premium', 'Date'].forEach((prop) => delete row.dataset[prop]);

    row.append(name, value);
    list.append(row);
  });
};

const sortRows = (option) => {
  const activeElement = document.querySelector('.list__row_active');
  const rows = document.querySelectorAll('.list__row');
  const rowsSorted = Array.from(rows).sort((a, b) => {
    const firtNum = parseFloat(a.dataset[option], 10);
    const secondNum = parseFloat(b.dataset[option], 10);
    if (firtNum > secondNum) return -1;
    if (firtNum < secondNum) return 1;
    return 0;
  });
  rows.forEach((row) => {
    row.style.setProperty('order', rowsSorted.indexOf(row));
    const value = row.children[1];
    value.textContent = row.dataset[option];
  });
  if (activeElement) activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

const splitWords = (string) => {
  let result = string;
  const words = ['Confirmed', 'Deaths', 'Recovered', 'Per', '100k'];
  words.forEach((word) => {
    const index = result.indexOf(word);
    if (index < 0) return;
    result = `${result.slice(0, index)} ${result.slice(index, result.length)}`;
  });
  return result;
};

const createSelector = (options) => {
  options.forEach((option) => {
    const selectorOption = document.createElement('option');
    selectorOption.value = option;
    selectorOption.textContent = splitWords(option);

    indicator.appendChild(selectorOption);
    if (option === 'TotalConfirmed') selectorOption.setAttribute('selected', true);
  });
  return options;
};

const listSearchHandler = () => {
  const input = document.querySelector('#list__search');
  const filter = input.value.toUpperCase();
  const rows = Array.from(document.getElementsByClassName('list__row'));

  rows.forEach((element) => {
    const row = element;
    const countryName = row.children[0].textContent;
    if (countryName.toUpperCase().indexOf(filter) >= 0) row.style.display = '';
    else row.style.display = 'none';
  });
};

const listClickHandler = (event) => {
  const target = event.target.parentElement;
  const activeElement = document.querySelector('.list__row_active');
  if (!target.classList.contains('list__row')) return;

  if (activeElement) activeElement.classList.remove('list__row_active');
  target.classList.add('list__row_active');
  if (activeElement === target) {
    document.querySelector('.row-title-area').dispatchEvent(new Event('click'));
    target.classList.remove('list__row_active');
  }
  searchInput.value = '';
  listSearchHandler();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

getSummary()
  .then((data) => {
    createSelector(createOptions(data));
    loadRows(data, 'TotalConfirmed');
    sortRows('TotalConfirmed');

    list.addEventListener('click', (event) => listClickHandler(event));
    searchInput.addEventListener('input', () => listSearchHandler());
    keyboardButton.addEventListener('click', () => keyboard.toggleKeyboard());
    indicator.addEventListener('change', () => sortRows(indicator.value));
  })
  .catch((e) => new Error(e));
