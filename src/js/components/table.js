import { casePrefixes, caseTypes, tableTitles } from '../constants';
import {
  buttonAbs,
  buttonArea,
  buttonCount,
  indicator,
  listContainer,
  tableDivs,
} from '../dom';

import { capitalize, getFlagURL } from '../utils';

const globalStats = {};

const state = {
  actualStats: {},
  allTime: true,
  absolute: true,
  confirmed: 0,
  recovered: 0,
  deaths: 0,
  resetToGlobalStats() {
    Object.assign(this.actualStats, globalStats);
  },
};

const round = (n) => Math.round(n * 100) / 100;

export const setStats = () => caseTypes.forEach((type) => {
  const prefix = capitalize(state.allTime ? casePrefixes.total : casePrefixes.new);
  const statName = `${prefix}${capitalize(type)}`;
  const delimeter = state.absolute ? 1 : state.actualStats.population / 100000;

  state[type] = state.actualStats[statName];
  tableDivs[type].innerText = round(state[type] / delimeter).toLocaleString();
});

const getSelectedCaseType = () => {
  const options = Array.from(indicator.querySelectorAll('option'));
  const selectedOption = options.filter((option) => option.selected)[0].value;
  options.forEach((option) => option.setAttribute('selected', false));
  const targetOption = options.filter((option) => option.value === indicator.value)[0];
  targetOption.setAttribute('selected', true);

  return selectedOption.replace(/(New)|(Total)|(Per100k)/g, '');
};

const dispatchListUpdate = () => setTimeout(() => indicator.dispatchEvent(new Event('change')), 0);

const toggleTotal = () => {
  const prefix = capitalize(!state.allTime ? casePrefixes.total : casePrefixes.new);
  const postfix = state.absolute ? '' : 'Per100k';
  const caseType = getSelectedCaseType();
  indicator.value = `${prefix}${caseType}${postfix}`;

  state.allTime = !state.allTime;

  tableDivs.totalOrNew.innerHTML = state.allTime ? tableTitles.total : tableTitles.new;

  dispatchListUpdate();
  buttonCount.classList.toggle('total');
  buttonCount.classList.toggle('new');
  setStats();
};

const toggleAbs = () => {
  const prefix = capitalize(state.allTime ? casePrefixes.total : casePrefixes.new);
  const postfix = state.absolute ? 'Per100k' : '';
  const casesType = getSelectedCaseType();
  indicator.value = `${prefix}${casesType}${postfix}`;

  state.absolute = !state.absolute;

  document.querySelectorAll('.tail').forEach((el) => {
    el.innerHTML = state.absolute ? '' : '&nbsp;per 100 k';
  });

  dispatchListUpdate();
  buttonAbs.classList.toggle('absolute');
  buttonAbs.classList.toggle('relative');
  setStats();
};

const handleListClick = (event) => {
  const { actualStats } = state;

  const listRows = Array.from(listContainer.querySelectorAll('.list__row'));
  const clickedRow = event.target.parentElement;
  const clickedCountryCode = clickedRow.dataset.CountryCode;
  const getActualStats = () => listRows
    .find((row) => row.dataset.CountryCode === clickedCountryCode).dataset;

  if (!clickedCountryCode) return;

  Object.assign(actualStats, getActualStats() || globalStats);

  buttonArea.innerHTML = `<span>ww</span>${actualStats.Country}`;
  buttonArea.firstChild.style.setProperty('background-image', getFlagURL(actualStats.CountryCode));
  setStats();
};

const handleIndicatorChange = (event) => {
  const { value } = event.target;
  if (!value) return;

  if (value.includes('Total') !== buttonCount.classList.contains('total')) toggleTotal();
  if (value.includes('100k') === buttonAbs.classList.contains('absolute')) toggleAbs();
  setStats();
};

const setTableWorldStats = () => {
  buttonArea.innerText = 'World';

  state.resetToGlobalStats();
  setStats();

  const activeListRow = document.querySelector('.list__row_active');
  const click = new Event('click', {
    bubbles: true,
  });
  if (activeListRow) activeListRow.firstChild.dispatchEvent(click);
};

export const setGlobalStats = (worldStats) => {
  Object.assign(globalStats, {
    population: worldStats.population,
    NewConfirmed: worldStats.todayCases,
    TotalConfirmed: worldStats.cases,
    NewDeaths: worldStats.todayDeaths,
    TotalDeaths: worldStats.deaths,
    NewRecovered: worldStats.todayRecovered,
    TotalRecovered: worldStats.recovered,
  });
  state.resetToGlobalStats();
};

buttonCount.addEventListener('click', toggleTotal);
buttonAbs.addEventListener('click', toggleAbs);
buttonArea.addEventListener('click', setTableWorldStats);
listContainer.addEventListener('click', handleListClick);
indicator.addEventListener('change', handleIndicatorChange);

export default globalStats;
