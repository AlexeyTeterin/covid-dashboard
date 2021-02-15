import {
  setGraphTheme, chart, dailyStats, updateChartData,
} from './graph';
import { getWorldStats, getAllCountriesStats, getWorldStatsByDay } from './CovidData';
import {
  searchInput, indicator, keyboardButton, listContainer,
} from './dom';
import {
  handleListSearch, sortRows, keyboard, createListIndicator, loadRows,
  hideLoadingText, handleListClick,
} from './list';
import { setUpdateTime, setGlobalStats, setStats } from './table';
import setMap from './map';

const resizeBtns = document.querySelectorAll('.max-min-btn');
const themeSwitch = document.querySelector('#checkbox');

const handleThemeSwitchClick = () => {
  const isDayTheme = document.body.classList.contains('day');
  document.body.classList.toggle('day');
  setGraphTheme(isDayTheme ? 'night' : 'day');
};

const handleResizeClick = (event) => {
  document.querySelector('.content-top').classList.toggle('flex');
  const target = event.target.parentElement;
  event.target.classList.toggle('min');
  Array.from(document.querySelectorAll('.resizable'))
    .filter((div) => div !== target)
    .forEach((div) => div.classList.toggle('hidden'));
  target.classList.toggle('fit-window');
};

getWorldStats()
  .then((res) => {
    setUpdateTime(res.updated);
    setGlobalStats(res);
    setStats();
  });

getWorldStatsByDay()
  .then((result) => {
    Object.assign(dailyStats, result);
    chart.data.labels = Object.keys(dailyStats.cases);
    updateChartData(dailyStats);
  });

getAllCountriesStats()
  .then((allCountriesStats) => {
    createListIndicator();
    loadRows(allCountriesStats);
    sortRows('TotalConfirmed');
    hideLoadingText();
    setMap(allCountriesStats, setStats());
    keyboard.init();
    listContainer.addEventListener('click', handleListClick);
  });

resizeBtns.forEach((btn) => btn.addEventListener('click', handleResizeClick));
themeSwitch.addEventListener('click', handleThemeSwitchClick);
searchInput.addEventListener('input', handleListSearch);
indicator.addEventListener('change', () => setTimeout(() => sortRows(), 0));
keyboardButton.addEventListener('click', () => keyboard.toggleKeyboard());
