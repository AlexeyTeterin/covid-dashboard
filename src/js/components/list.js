// @flow
import { basicIndicators, MESSAGES } from '../constants';
import { calcPer100k } from '../utils';
import { getListRows, indicator, listContainer, loading } from '../dom';
import { allCountriesStats, getFlagURL } from '../model';

const loadListRows = async (allCountriesData) => {
  await allCountriesData
    .filter((countryData) => countryData.countryInfo.iso2 !== null)
    .forEach((countryData) => {
      const row = document.createElement('div');
      const countryName = document.createElement('div');
      const statValue = document.createElement('div');
      const flagURL = getFlagURL(countryData.countryInfo.iso2);

      row.classList.add('list__row');
      countryName.innerText = countryData.country;
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
      } = countryData;
      const countryDataset = {
        CountryCode: countryInfo.iso2,
        id: countryInfo.iso3,
        Country: countryData.country,
        population: population.toString(),
        TotalConfirmed: cases.toString(),
        TotalRecovered: recovered.toString(),
        TotalDeaths: deaths.toString(),
        NewConfirmed: todayCases.toString(),
        NewRecovered: todayRecovered.toString(),
        NewDeaths: todayDeaths.toString(),
        TotalConfirmedPer100k: calcPer100k(cases, population).toString(),
        TotalRecoveredPer100k: calcPer100k(recovered, population).toString(),
        TotalDeathsPer100k: calcPer100k(deaths, population).toString(),
        NewConfirmedPer100k: calcPer100k(todayCases, population).toString(),
        NewRecoveredPer100k: calcPer100k(todayRecovered, population).toString(),
        NewDeathsPer100k: calcPer100k(todayDeaths, population).toString(),
      };

      Object.assign(row.dataset, countryDataset);

      row.append(countryName, statValue);
      listContainer?.append(row);
    });
  if (listContainer) listContainer.dataset.status = 'loaded';
};

export const sortListRows = (): void => {
  if (!(indicator instanceof HTMLSelectElement)) return;

  const option = indicator?.value;
  const activeElement = document.querySelector('.list__row_active');
  const rows = getListRows();
  const rowsSorted = rows ? Array.from(rows).sort((a, b) => {
    const firstNum = parseFloat(a.dataset[option]);
    const secondNum = parseFloat(b.dataset[option]);
    if (firstNum === secondNum) return 0;
    return (firstNum > secondNum) ? -1 : 1;
  }) : null;

  rows?.forEach((row) => {
    const rowPosition = rowsSorted?.indexOf(row);

    row.style.setProperty('order', rowPosition?.toString());
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

    indicator?.appendChild(selectorOption);
    if (option === 'TotalConfirmed') selectorOption.setAttribute('selected', 'true');
  });
  return options;
};

export const resetList = async () => {
  createListIndicator();
  await loadListRows(allCountriesStats);
  sortListRows();
};

setTimeout((): void => {
  if (loading?.innerText) loading.innerText = MESSAGES.apiError;
  loading?.classList.remove('pulsate');
}, 7000);
