import { getAllCountriesStats, getWorldStats } from './CovidData.js';
import Keyboard from './keyboard.js';

const searchInput = document.querySelector('#list__search');
export const indicator = document.querySelector('#list__indicator');
export const list = document.querySelector('.list__container');
const keyboardButton = document.querySelector('.keyboard-button');

const keyboard = new Keyboard();
keyboard.init();

const createOptions = (data) => {
  const options = Object.keys(data);
  options.forEach((opt) => options.push(`${opt}Per100k`));
  return options;
};

const calcPer100k = (value, population) => +((value / population) * 100000).toFixed(2);

const loadRows = (data) => {
  data
    .filter((country) => country.countryInfo.iso2 !== null)
    .forEach((country) => {
      const row = document.createElement('div');
      const name = document.createElement('div');
      const value = document.createElement('div');

      row.classList.add('list__row');
      name.textContent = country.country;
      name.style.setProperty('background-image', `url(https://www.countryflags.io/${country.countryInfo.iso2}/shiny/24.png)`);
      const countryDataset = {
        CountryCode: country.countryInfo.iso2,
        Country: country.country,
        population: country.population,
        TotalConfirmed: country.cases,
        TotalRecovered: country.recovered,
        TotalDeaths: country.deaths,
        NewConfirmed: country.todayCases,
        NewRecovered: country.todayRecovered,
        NewDeaths: country.todayDeaths,
        TotalConfirmedPer100k: country.casesPerOneMillion / 10,
        TotalRecoveredPer100k: country.recoveredPerOneMillion / 10,
        TotalDeathsPer100k: country.deathsPerOneMillion / 10,
        NewConfirmedPer100k: calcPer100k(country.todayCases, country.population),
        NewRecoveredPer100k: calcPer100k(country.todayRecovered, country.population),
        NewDeathsPer100k: calcPer100k(country.todayDeaths, country.population),
      };

      // value.textContent = country.cases;
      Object.assign(row.dataset, countryDataset);

      row.append(name, value);
      list.append(row);
    });
};

const sortRows = () => {
  const option = indicator.value;

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
    target.classList.remove('list__row_active');
    setTimeout(() => document.querySelector('.row-title-area').dispatchEvent(new Event('click')), 50);
  }
  searchInput.value = '';
  listSearchHandler();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

setTimeout(() => {
  document.querySelector('.loading').textContent = 'API performs caching at the moment, please try to reload page 5 minutes later.';
  document.querySelector('.loading').classList.remove('pulsate');
}, 7000);

const hideLoadingText = () => {
  document.querySelector('.loading').classList.add('hidden');
  document.querySelector('.content-top').classList.remove('hidden');
  document.querySelector('.content-bot').classList.remove('hidden');
};

getWorldStats()
  .then((WorldStats) => {
    const global = {
      NewConfirmed: WorldStats.todayCases,
      TotalConfirmed: WorldStats.cases,
      NewDeaths: WorldStats.todayDeaths,
      TotalDeaths: WorldStats.deaths,
      NewRecovered: WorldStats.todayRecovered,
      TotalRecovered: WorldStats.recovered,
    };
    createSelector(createOptions(global));
  })
  .then(() => getAllCountriesStats())
  .then((allCountriesStats) => {
    // console.log(allCountriesStats);
    hideLoadingText();
    loadRows(allCountriesStats);
    sortRows('TotalConfirmed');

    list.addEventListener('click', (event) => listClickHandler(event));
    searchInput.addEventListener('input', () => listSearchHandler());
    keyboardButton.addEventListener('click', () => keyboard.toggleKeyboard());
    indicator.addEventListener('change', () => setTimeout(() => sortRows(), 0));
  })
  .catch((e) => new Error(e));
