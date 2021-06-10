import {
  handleListClick,
  handleListSearch,
  handleResizeClick,
  handleThemeSwitchClick,
  hideLoadingText,
} from './controller';
import { getAllData } from './utils';
import Keyboard from './components/keyboard';
import { updateChartData, worldDailyStats } from './components/graph';
import {
  indicator,
  keyboardButton,
  listContainer,
  resizeBtns,
  searchInput,
  themeSwitch,
} from './dom';
import { createListIndicator, loadRows, sortRows } from './components/list';
import { setGlobalStats, setStats, setUpdateTime } from './components/table';
import setMap from './components/map';
import '../css/style.scss';
import '../css/keyboard.css';

getAllData()
  .then(([worldStats, worldByDay, allCountriesStats]) => {
    setUpdateTime(worldStats.updated);
    setGlobalStats(worldStats);
    setStats();

    Object.assign(worldDailyStats, worldByDay);
    updateChartData();

    createListIndicator();
    loadRows(allCountriesStats);
    sortRows('TotalConfirmed');
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
