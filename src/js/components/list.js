import { basicIndicators, MESSAGES } from '../constants';
import { calcPer100k } from '../utils';
import { getListRows, indicator, listContainer, loading } from '../dom';
import { allCountriesStats, getFlagURL } from '../model';

const loadListRows = async (data) => {
  await data
    .filter((country) => country.countryInfo.iso2 !== null)
    .forEach((country) => {
      const row = document.createElement('div');
      const countryName = document.createElement('div');
      const statValue = document.createElement('div');
      const flagURL = getFlagURL(country.countryInfo.iso2);

      row.classList.add('list__row');
      countryName.textContent = country.country;
      countryName.style.setProperty('background-image', flagURL);
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

      row.append(countryName, statValue);
      listContainer.append(row);
    });
  listContainer.dataset.status = 'loaded';
};

export const sortListRows = () => {
  const option = indicator.value;

  const activeElement = document.querySelector('.list__row_active');
  const rows = getListRows();
  const rowsSorted = Array.from(rows).sort((a, b) => {
    const firstNum = parseFloat(a.dataset[option], 10);
    const secondNum = parseFloat(b.dataset[option], 10);
    if (firstNum === secondNum) return 0;
    return (firstNum > secondNum) ? -1 : 1;
  });

  rows.forEach((row) => {
    const rowPosition = rowsSorted.indexOf(row);

    row.style.setProperty('order', rowPosition);
    const value = row.children[1];
    value.textContent = parseFloat(row.dataset[option]).toLocaleString();
    const pos = value.textContent.length - 2;
    if (value.textContent.charAt(pos) === ',') value.textContent += '0';
  });
  if (activeElement) {
    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const createListIndicator = () => {
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

export const resetList = async () => {
  createListIndicator();
  await loadListRows(allCountriesStats);
  sortListRows();
};

setTimeout(() => {
  loading.textContent = MESSAGES.apiError;
  loading.classList.remove('pulsate');
}, 7000);
