import {
  buttonAbs,
  buttonArea,
  buttonCount,
  divCases,
  divDeaths,
  divRecovered,
  indicator,
  listContainer,
} from '../dom';
import { getFlagURL } from '../utils';

const stat = {
  world: true, total: true, absolute: true,
};
let source;
const globalStats = {};
let con;
let deat;
let rec;

const round = (n) => Math.round(n * 100) / 100;

export const setStats = () => {
  if (!source) {
    divCases.innerText = 'no info';
    divDeaths.innerText = 'no info';
    divRecovered.innerText = 'no info';
    return;
  }
  let k = 1;
  if (!stat.absolute) {
    k = source.population / 100000;
  }
  if (stat.total) {
    con = source.TotalConfirmed;
    deat = source.TotalDeaths;
    rec = source.TotalRecovered;
  } else {
    con = source.NewConfirmed;
    deat = source.NewDeaths;
    rec = source.NewRecovered;
  }
  divCases.innerText = round(con / k).toLocaleString();
  divDeaths.innerText = round(deat / k).toLocaleString();
  divRecovered.innerText = round(rec / k).toLocaleString();
};

const toggleTotal = () => {
  const options = Array.from(indicator.querySelectorAll('option'));
  const selectedOption = options.filter((option) => option.selected)[0].value;
  options.forEach((option) => option.setAttribute('selected', false));

  const totalOrNew = stat.total ? 'New' : 'Total';
  const absOrRel = stat.absolute ? '' : 'Per100k';
  const casesType = selectedOption.replace(/(New)|(Total)|(Per100k)/g, '');
  indicator.value = `${totalOrNew}${casesType}${absOrRel}`;

  const targetOption = options.filter((option) => option.value === indicator.value)[0];
  targetOption.setAttribute('selected', true);

  stat.total = !stat.total;
  if (stat.total) {
    document.querySelector('.total-or-new').innerHTML = 'all time';
  } else {
    document.querySelector('.total-or-new').innerHTML = 'last day';
  }

  setTimeout(() => indicator.dispatchEvent(new Event('change')), 0);
  buttonCount.classList.toggle('total');
  buttonCount.classList.toggle('new');
  setStats();
};

const toggleAbs = () => {
  const options = Array.from(indicator.querySelectorAll('option'));
  const selectedOption = options.filter((option) => option.selected)[0].value;
  options.forEach((option) => option.setAttribute('selected', false));

  const totalOrNew = stat.total ? 'Total' : 'New';
  const absOrRel = stat.absolute ? 'Per100k' : '';
  const casesType = selectedOption.replace(/(New)|(Total)|(Per100k)/g, '');
  indicator.value = `${totalOrNew}${casesType}${absOrRel}`;

  const targetOption = options.filter((option) => option.value === indicator.value)[0];
  targetOption.setAttribute('selected', true);

  stat.absolute = !stat.absolute;

  if (stat.absolute) {
    document.querySelectorAll('.tail').forEach((el) => {
      const span = el;
      span.innerHTML = '';
    });
  } else {
    document.querySelectorAll('.tail').forEach((el) => {
      const span = el;
      span.innerHTML = '&nbsp;per 100 k';
    });
  }

  setTimeout(() => indicator.dispatchEvent(new Event('change')), 0);
  buttonAbs.classList.toggle('absolute');
  buttonAbs.classList.toggle('relative');
  setStats();
};

const handleListClick = (event) => {
  const listRows = Array.from(listContainer.querySelectorAll('.list__row'));
  const clickedRow = event.target.parentElement;
  const clickedCountryCode = clickedRow.dataset.CountryCode;

  if (!clickedCountryCode) return;

  source = listRows
    .find((row) => row.dataset.CountryCode === clickedCountryCode).dataset || globalStats;
  buttonArea.innerHTML = `<span>ww</span>${source.Country}`;
  buttonArea.firstChild.style.setProperty('background-image', getFlagURL(source.CountryCode));
  setStats(source);
};

const handleIndicatorChange = (event) => {
  const { value } = event.target;
  if (value) {
    if (value.includes('Total') !== buttonCount.classList.contains('total')) toggleTotal();
    if (value.includes('100k') === buttonAbs.classList.contains('absolute')) toggleAbs();
    setStats();
  }
};

const resetToWorldStats = () => {
  buttonArea.innerText = 'World';
  source = globalStats;
  setStats();

  const activeListRow = document.querySelector('.list__row_active');
  const click = new Event('click', {
    bubbles: true,
  });
  if (activeListRow) activeListRow.firstChild.dispatchEvent(click);
};

export const setUpdateTime = (updated) => {
  const date = new Date(updated);
  document.querySelector('.day-updated')
    .innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
  source = globalStats;
  con = source.TotalConfirmed;
  deat = source.TotalDeaths;
  rec = source.TotalRecovered;
};

buttonCount.addEventListener('click', toggleTotal);
buttonAbs.addEventListener('click', toggleAbs);
buttonArea.addEventListener('click', resetToWorldStats);
listContainer.addEventListener('click', handleListClick);
indicator.addEventListener('change', handleIndicatorChange);

export default globalStats;
