// @flow
import { basicIndicators, MESSAGES } from '../constants';
import type { ICountryStats } from '../types';
import { calcPer100k } from '../utils';
import { getListRows, indicator, listContainer, loading } from '../dom';
import { allCountriesStats, getFlagURL } from '../model';
import type { ICountryDataset } from './types';

const loadListRows = async (allCountriesData: Array<ICountryStats>): Promise<void> => {
  await allCountriesData
    .filter((countryData: ICountryStats) => countryData.countryInfo.iso2 !== null)
    .forEach((countryData: ICountryStats) => {
      const row = document.createElement('div');
      const countryName = document.createElement('div');
      const statValue = document.createElement('div');
      const {
        countryInfo,
        population,
        cases,
        country,
        recovered,
        deaths,
        todayCases,
        todayDeaths,
        todayRecovered,
      } = countryData;
      const flagURL: string = getFlagURL(countryData.countryInfo.iso2);
      const countryDataset: ICountryDataset = {
        CountryCode: countryInfo.iso2,
        id: countryInfo.iso3,
        Country: country,
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

      row.classList.add('list__row');
      countryName.innerText = country;
      countryName.style.setProperty('background-image', flagURL);

      Object.assign(row.dataset, countryDataset);

      row.append(countryName, statValue);
      listContainer?.append(row);
    });
  if (listContainer) listContainer.dataset.status = 'loaded';
};

export const sortListRows = (): void => {
  if (!(indicator instanceof HTMLSelectElement)) return;

  const option: string = indicator?.value;
  const activeElement: ?HTMLElement = document.querySelector('.list__row_active');
  const rows: ?NodeList<HTMLElement> = getListRows();
  const rowsSorted: ?Array<HTMLElement> = rows ? Array.from(rows).sort((a, b) => {
    const firstNum = parseFloat(a.dataset[option]);
    const secondNum = parseFloat(b.dataset[option]);
    if (firstNum === secondNum) return 0;
    return (firstNum > secondNum) ? -1 : 1;
  }) : null;

  rows?.forEach((row: HTMLElement) => {
    const rowPosition: ?number = rowsSorted?.indexOf(row);

    row.style.setProperty('order', rowPosition?.toString());
    const firstChild: HTMLElement = row.children[1];
    firstChild.textContent = parseFloat(row.dataset[option]).toLocaleString();
    const pos: number = firstChild.textContent.length - 2;
    if (firstChild.textContent.charAt(pos) === ',') firstChild.textContent += '0';
  });

  if (activeElement) {
    activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const createListIndicator = (): void => {
  const splitWords = (str: string): string => {
    let result: string = str;
    ['Total', 'Confirmed', 'Deaths', 'Recovered', 'Per', 'New'].forEach((word: string) => {
      result = result.replace(word, `${word} `);
    });
    return result;
  };
  const options: Array<string> = basicIndicators.slice();

  options.forEach((option: string) => options.push(`${option}Per100k`));
  options.forEach((option: string) => {
    const selectorOption: HTMLOptionElement = document.createElement('option');
    selectorOption.value = option;
    selectorOption.textContent = splitWords(option);

    indicator?.appendChild(selectorOption);
    if (option === 'TotalConfirmed') selectorOption.setAttribute('selected', 'true');
  });
};

export const resetList = async (): Promise<void> => {
  createListIndicator();
  await loadListRows(allCountriesStats);
  sortListRows();
};

setTimeout((): void => {
  if (loading?.innerText) loading.innerText = MESSAGES.apiError;
  loading?.classList.remove('pulsate');
}, 7000);
