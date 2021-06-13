import Chart from 'chart.js';
import globalStats from './table';
import graphSettings, { defaultDatasetStyle } from './graphSettings';
import {
  buttonAbs,
  canvasEl,
  getActiveListRow,
  graphMessageEl,
  graphTimeframeSelect,
  indicator,
  listContainer,
} from '../dom';
import { getCountryStatsByDay, globalDailyStats } from '../model';
import { MESSAGES, MSG_APPEAR_DURATION } from '../constants';
import { calcCasesPer100k } from '../utils';

const state = {
  dailyStats: null,
  countryCode: null,
  timeframe: 0,
};

const chart = new Chart(canvasEl, graphSettings);

chart.message = graphMessageEl;

chart.setMessage = function set(msg) {
  this.message.innerHTML = msg;
  this.message.classList.add('pulsate');
  this.message.classList.remove('hidden');
};

chart.clearMessage = function set() {
  this.message.innerHTML = '';
  this.message.classList.remove('pulsate');
  setTimeout(() => this.message.classList.add('hidden'), MSG_APPEAR_DURATION);
};

chart.calcConfirmedByDay = (totalCasesByDay) => {
  const cases = Object.values(totalCasesByDay);
  return cases.map((el, index) => {
    if (index === 0) return el;
    return el - Object.values(totalCasesByDay)[index - 1];
  });
};

chart.setTimeframe = (stats) => {
  const { cases, recovered, deaths } = stats;
  const { datasets } = chart.data;

  chart.data.labels = Object.keys(globalDailyStats.cases).slice(-state.timeframe);

  [cases, recovered, deaths]
    .forEach((set, index) => {
      datasets[index].data = Object.values(set).slice(-state.timeframe);
      datasets[index + 3].data = chart.calcConfirmedByDay(set).slice(-state.timeframe);
    });
};

chart.addTailToLabels = (tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    if (dataset.label.includes(tail)) return;
    dataset.label += tail;
  });

chart.removeTailFromLabels = function remove(tail) {
  this.data.datasets.forEach((dataset) => {
    const tailIndex = dataset.label.indexOf(tail);
    if (tailIndex > 0) dataset.label = dataset.label.substring(0, tailIndex);
  });
};

chart.setRelativeValues = function set() {
  const { datasets } = this.data;
  datasets.forEach((dataset) => {
    dataset.data = calcCasesPer100k(dataset.data, this.population);
  });
};

chart.setTitle = function set(text) {
  const { title } = this.options;
  title.text = text;
};

chart.reset = function reset(stats = globalDailyStats, countryCode) {
  const worldPopulation = globalStats.population || localStorage.worldPopulation || 7798000000;
  const activeRow = getActiveListRow();
  const isRelativeValues = buttonAbs.classList.contains('relative');

  this.population = countryCode ? activeRow.dataset.population : worldPopulation;
  localStorage.worldPopulation = worldPopulation;

  this.setTimeframe(stats);
  this.setDatasetStyles();

  if (isRelativeValues) chart.setRelativeValues();
  if (!countryCode) chart.setTitle('World');

  this.update();
};

chart.setSize = (style) => {
  const { scales, title, legend } = chart.options;
  const isFull = style === 'full';

  scales.xAxes[0].display = !!isFull;
  scales.yAxes[0].ticks.fontSize = isFull ? 12 : 10;
  title.fontSize = isFull ? 20 : 16;
  legend.labels.fontSize = isFull ? 12 : 10;
  legend.position = isFull ? 'bottom' : 'right';
};

chart.setDatasetStyles = () => {
  chart.data.datasets.forEach((dataset, index) => {
    Object.assign(dataset, defaultDatasetStyle);
    dataset.borderColor = dataset.pointBackgroundColor;
    if (index > 2) dataset.hidden = true;
  });
};

chart.setGraphTheme = function set(theme) {
  const { xAxes, yAxes } = this.options.scales;
  const isDayTheme = theme === 'day';
  const setRgba = (n, alpha) => `rgba(${n}, ${n}, ${n}, ${alpha})`;

  Chart.defaults.global.defaultFontColor = isDayTheme ? setRgba(0, 0.7) : setRgba(255, 0.7);
  xAxes[0].gridLines.color = isDayTheme ? setRgba(0, 0.15) : setRgba(255, 0.1);
  yAxes[0].gridLines.color = xAxes[0].gridLines.color;
  xAxes[0].ticks.fontColor = isDayTheme ? setRgba(0, 0.5) : setRgba(255, 0.5);
  yAxes[0].ticks.fontColor = xAxes[0].ticks.fontColor;
  chart.data.datasets[2].pointBackgroundColor = isDayTheme ? setRgba(0, 0.8) : setRgba(255, 0.4);
  chart.data.datasets[5].pointBackgroundColor = isDayTheme ? setRgba(0, 0.4) : setRgba(255, 0.8);

  this.update();
};

const observer = new ResizeObserver((entries) => {
  Object.values(entries).forEach((entry) => {
    const { width } = entry.contentRect;
    if (width < 600) chart.setSize('compact');
    if (width >= 600) chart.setSize('full');
  });
});

const handleCountrySelection = (countryCode) => {
  chart.clear();

  chart.setMessage(MESSAGES.loading);

  getCountryStatsByDay(countryCode)
    .then((res) => {
      const countryName = getActiveListRow().dataset.Country;

      state.countryCode = countryCode;
      chart.setTitle(countryName);

      if (!res.timeline) {
        state.dailyStats = null;
        chart.data.datasets.forEach((dataset) => {
          dataset.data = [];
        });

        chart.setMessage(`No data available for ${countryName}`);
      }
      if (res.timeline) {
        state.dailyStats = res.timeline;
        chart.clearMessage();
        chart.reset(res.timeline, countryCode);
      }
    })
    .catch((e) => new Error(e.message));
};

const handleListClick = (event) => {
  const target = event.target.parentElement;
  const { CountryCode } = target.dataset;

  if (!target.classList.contains('list__row')) return;
  const countryIsSelected = !target.classList.contains('list__row_active');
  if (!countryIsSelected) {
    state.countryCode = null;
    state.dailyStats = null;
    chart.reset(globalDailyStats);
    chart.clearMessage();
  }
  if (countryIsSelected) {
    state.countryCode = CountryCode;
    handleCountrySelection(CountryCode);
  }
};

const handleButtonAbsClick = () => {
  const activeRow = getActiveListRow();
  const absoluteOn = !indicator.value.includes('100k');
  if (!absoluteOn) chart.addTailToLabels(' per 100k');
  if (absoluteOn) chart.removeTailFromLabels(' per 100k');

  if (activeRow) handleCountrySelection(activeRow.dataset.CountryCode);
  if (!activeRow) chart.reset(globalDailyStats);
};

const handleIndicatorChange = () => {
  const countryIsSelected = document.querySelector('.list__row_active');
  if (!countryIsSelected) {
    setTimeout(() => {
      chart.reset(globalDailyStats);
    }, 0);
  }
  if (countryIsSelected) {
    setTimeout(() => handleCountrySelection(countryIsSelected.dataset.CountryCode), 0);
  }

  const absoluteOn = !indicator.value.includes('100k');
  if (!absoluteOn) chart.addTailToLabels(' per 100k');
  else chart.removeTailFromLabels(' per 100k');
};

const handleTimeframeChange = (event) => {
  const { dailyStats, countryCode } = state;
  const { value } = event.target;
  const isCountrySelected = Boolean(state.countryCode);

  state.timeframe = value;
  if (isCountrySelected) {
    chart.reset(dailyStats, countryCode);
  } else {
    chart.reset(globalDailyStats);
  }
};

listContainer.addEventListener('click', handleListClick);
buttonAbs.addEventListener('click', handleButtonAbsClick);
indicator.addEventListener('change', handleIndicatorChange);
graphTimeframeSelect.addEventListener('change', handleTimeframeChange);
observer.observe(document.querySelector('.graph'));

export default chart;
