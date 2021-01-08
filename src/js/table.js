import { getWorldStats, getAllCountriesStats } from './CovidData.js';
import { list, indicator } from './list.js';
import setMap from './map.js';

const divDeaths = document.querySelector('.table-deaths');
const divRecovered = document.querySelector('.table-recovered');
const divCases = document.querySelector('.table-cases');
const buttonArea = document.querySelector('.row-title-area');
export const buttonCount = document.querySelector('.row-title-count');
export const buttonAbs = document.querySelector('.row-title-abs');

const stat = { world: true, total: true, absolute: true };
let source;
const globalStats = {};
let con;
let deat;
let rec;

const round = (n) => Math.round(n * 100) / 100;
const setStats = () => {
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
  divCases.innerText = round(con / k);
  divDeaths.innerText = round(deat / k);
  divRecovered.innerText = round(rec / k);
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

  // indicator.dispatchEvent(new Event('change'));

  stat.total = !stat.total;
  buttonCount.innerText = stat.total ? 'Total' : 'New';
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

  // indicator.dispatchEvent(new Event('change'));

  stat.absolute = !stat.absolute;
  buttonAbs.innerText = stat.absolute ? 'Absolute' : 'Per 100k';
  buttonAbs.classList.toggle('absolute');
  buttonAbs.classList.toggle('relative');
  setStats();
};
const handleListClick = (event) => {
  const listRows = Array.from(list.querySelectorAll('.list__row'));
  const clickedRow = event.target.parentElement;
  const clickedCountryCode = clickedRow.dataset.CountryCode;

  if (!clickedCountryCode) return;

  source = listRows
    .find((row) => row.dataset.CountryCode === clickedCountryCode).dataset || globalStats;
  buttonArea.innerText = source.Country;
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
  const click = new Event('click', { bubbles: true });
  if (activeListRow) activeListRow.firstChild.dispatchEvent(click);
};
const setUpdateTime = (updated) => {
  const date = new Date(updated);
  document.querySelector('.day-updated')
    .innerText = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
const setGlobalStats = (worldStats) => {
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
list.addEventListener('click', handleListClick);
indicator.addEventListener('change', handleIndicatorChange);

getWorldStats()
  .then((res) => {
    setUpdateTime(res.updated);
    setGlobalStats(res);
    setStats();
  })
  .then(() => getAllCountriesStats())
  .then((allCountriesStats) => setMap(allCountriesStats, setStats()));

export { globalStats };
