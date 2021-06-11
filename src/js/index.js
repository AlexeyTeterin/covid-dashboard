import {
  handleListClick,
  handleListSearch,
  handleResizeClick,
  handleThemeSwitchClick,
  hideLoadingText,
} from './controller';
import { setUpdateTime } from './utils';
import Keyboard from './components/keyboard';
import { updateChartData } from './components/graph';
import {
  indicator,
  keyboardButton,
  listContainer,
  resizeBtns,
  searchInput,
  themeSwitch,
} from './dom';
import { createListIndicator, loadRows, sortRows } from './components/list';
import { setStats } from './components/table';
import setMap from './components/map';
import '../css/style.scss';
import '../css/keyboard.css';
import { getAllData, globalDailyStats, setGlobalStats } from './model';

getAllData()
  .then(([worldStats, worldDailyStats, allCountriesStats]) => {
    setGlobalStats(worldStats);
    setUpdateTime(worldStats.updated);
    setStats();

    Object.assign(globalDailyStats, worldDailyStats);
    updateChartData();

    createListIndicator();
    loadRows(allCountriesStats);
    sortRows();
    hideLoadingText();
    setMap(allCountriesStats);
    listContainer.addEventListener('click', handleListClick);
  })
  .then(() => {
    const keyboard = new Keyboard();
    keyboard.init();
    keyboardButton.addEventListener('click', () => keyboard.toggleKeyboard());

    resizeBtns.forEach((btn) => btn.addEventListener('click', handleResizeClick));
    themeSwitch.addEventListener('click', handleThemeSwitchClick);
    searchInput.addEventListener('input', handleListSearch);
    indicator.addEventListener('change', () => setTimeout(() => sortRows(), 0));
  });
