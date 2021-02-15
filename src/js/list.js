import Keyboard from './Keyboard';
import {
  listContainer, indicator, searchInput, loading,
} from './dom';

export const basicIndicators = [
  'TotalConfirmed', 'TotalRecovered', 'TotalDeaths',
  'NewConfirmed', 'NewRecovered', 'NewDeaths',
];

export const keyboard = new Keyboard();

const calcPer100k = (value, population) => +((value / population) * 100000).toFixed(2);

export const loadRows = async (data) => {
  await data
    .filter((country) => country.countryInfo.iso2 !== null)
    .forEach((country) => {
      const row = document.createElement('div');
      const name = document.createElement('div');
      const value = document.createElement('div');

      row.classList.add('list__row');
      name.textContent = country.country;
      name.style.setProperty('background-image', `url(https://www.countryflags.io/${country.countryInfo.iso2}/shiny/24.png)`);
      const {
        countryInfo,
        population,
        cases,
        recovered,
        deaths,
        todayCases,
        todayDeaths,
        todayRecovered,
      } = country;
      const countryDataset = {
        CountryCode: countryInfo.iso2,
        id: countryInfo.iso3,
        Country: country.country,
        population,
        TotalConfirmed: cases,
        TotalRecovered: recovered,
        TotalDeaths: deaths,
        NewConfirmed: todayCases,
        NewRecovered: todayRecovered,
        NewDeaths: todayDeaths,
        TotalConfirmedPer100k: calcPer100k(cases, population),
        TotalRecoveredPer100k: calcPer100k(recovered, population),
        TotalDeathsPer100k: calcPer100k(deaths, population),
        NewConfirmedPer100k: calcPer100k(todayCases, population),
        NewRecoveredPer100k: calcPer100k(todayRecovered, population),
        NewDeathsPer100k: calcPer100k(todayDeaths, population),
      };

      Object.assign(row.dataset, countryDataset);

      row.append(name, value);
      listContainer.append(row);
    });
  listContainer.dataset.status = 'loaded';
};

export const sortRows = () => {
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
    value.textContent = parseFloat(row.dataset[option]).toLocaleString();
    const pos = value.textContent.length - 2;
    if (value.textContent.charAt(pos) === ',') value.textContent += '0';
  });
  if (activeElement) activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const createListIndicator = () => {
  const splitWords = (string) => {
    let result = string;
    ['Total', 'Confirmed', 'Deaths', 'Recovered', 'Per', 'New'].forEach((word) => {
      result = result.replace(word, `${word} `);
    });
    return result;
  };
  const options = basicIndicators.slice();

  options.forEach((option) => options.push(`${option}Per100k`));
  options.forEach((option) => {
    const selectorOption = document.createElement('option');
    selectorOption.value = option;
    selectorOption.textContent = splitWords(option);

    indicator.appendChild(selectorOption);
    if (option === 'TotalConfirmed') selectorOption.setAttribute('selected', true);
  });
  return options;
};

export const handleListSearch = () => {
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

export const handleListClick = (event) => {
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
  handleListSearch();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

export const hideLoadingText = () => {
  loading.classList.add('hidden');
  document.querySelector('.content-top').classList.remove('hidden');
  document.querySelector('.content-bot').classList.remove('hidden');
};

setTimeout(() => {
  loading.textContent = 'API performs caching at the moment, please try to reload page 5 minutes later.';
  loading.classList.remove('pulsate');
}, 7000);
