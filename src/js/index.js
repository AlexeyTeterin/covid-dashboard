import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  applySavedTheme,
  handleListClick,
  handleListSearch,
  handleResizeClick,
  handleThemeSwitchClick,
  hideLoadingMessage,
} from './controller';
import { setUpdateTime } from './utils';
import Keyboard from './components/keyboard';
import chart from './components/graph';
import {
  indicator,
  keyboardButton,
  listContainer,
  resizeBtns,
  searchInput,
  themeSwitch,
} from './dom';
import { resetList, sortListRows } from './components/list';
import { resetTable } from './components/table';
import { resetMap } from './components/map';
import '../css/style.scss';
import '../css/keyboard.css';
import { getAllData, setAllCountriesStats, setGlobalDailyStats, setGlobalStats } from './model';

applySavedTheme();

getAllData()
  .then(async ([worldStats, worldDailyStats, allCountriesStats]) => {
    hideLoadingMessage();
    setUpdateTime(worldStats.updated);

    setGlobalStats(worldStats);
    setGlobalDailyStats(worldDailyStats);
    setAllCountriesStats(allCountriesStats);

    resetTable();
    chart.reset();
    await resetList();
    await resetMap();
  })
  .then(() => {
    const keyboard = new Keyboard();
    keyboard.init();

    keyboardButton?.addEventListener('click', () => keyboard.toggleKeyboard());
    listContainer?.addEventListener('click', handleListClick);
    indicator?.addEventListener('change', () => setTimeout(() => sortListRows(), 0));
    resizeBtns.forEach((btn) => btn.addEventListener('click', handleResizeClick));
    themeSwitch?.addEventListener('click', handleThemeSwitchClick);
    searchInput?.addEventListener('input', handleListSearch);
  });
