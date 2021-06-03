import Chart from 'chart.js';
import { getCountryStatsByDay } from '../utils';
import globalStats from './table';
import graphSettings from './graphSettings';
import {
  buttonAbs,
  canvasEl,
  getActiveListRow,
  graphMessage,
  graphTimeframeSelect,
  indicator,
  listContainer,
} from '../dom';

export const chart = new Chart(canvasEl, graphSettings);

export const worldDailyStats = {};

const state = {
  dailyStats: null,
  countryCode: null,
  timeframe: 0,
};

const MSG_APPEAR_DURATION = 150;

const newCasesByDay = (totalCasesByDay) => {
  const cases = Object.values(totalCasesByDay);
  return cases.map((el, index) => {
    if (index === 0) return el;
    return el - Object.values(totalCasesByDay)[index - 1];
  });
};

const casesPer100k = (casesByDay, population) => casesByDay
  .map((el) => ((el / population) * 100000).toFixed(2));

export const updateChartData = (data = worldDailyStats, countryCode) => {
  const { cases, recovered, deaths } = data;
  const { datasets } = chart.data;
  const { options } = chart;
  const worldPopulation = globalStats.population || localStorage.worldPopulation || 7798000000;
  localStorage.worldPopulation = worldPopulation;
  const selectedCountry = document.querySelector('.list__row_active');
  const population = countryCode ? selectedCountry.dataset.population : worldPopulation;
  const relativeValues = buttonAbs.classList.contains('relative');

  chart.data.labels = Object.keys(worldDailyStats.cases).slice(-state.timeframe);

  [cases, recovered, deaths]
    .forEach((set, index) => {
      datasets[index].data = Object.values(set).slice(-state.timeframe);
      datasets[index + 3].data = newCasesByDay(set).slice(-state.timeframe);
    });

  if (relativeValues) {
    datasets.forEach((dataset) => {
      dataset.data = casesPer100k(dataset.data, population);
    });
  }
  if (!countryCode) options.title.text = 'World';

  chart.update();
};

const setGraphMessage = (msg) => {
  graphMessage.innerHTML = msg;
  graphMessage.classList.add('pulsate');
  graphMessage.classList.remove('hidden');
};

const clearGraphMessage = () => {
  graphMessage.innerHTML = '';
  graphMessage.classList.remove('pulsate');
  setTimeout(() => graphMessage.classList.add('hidden'), MSG_APPEAR_DURATION);
};

const handleCountrySelection = (countryCode) => {
  chart.clear();

  setGraphMessage('loading...');

  getCountryStatsByDay(countryCode)
    .then((res) => {
      const countryName = getActiveListRow().dataset.Country;

      state.countryCode = countryCode;
      chart.options.title.text = countryName;

      if (!res.timeline) {
        state.dailyStats = null;
        chart.data.datasets.forEach((dataset) => {
          dataset.data = [];
        });

        setGraphMessage(`No data available for ${countryName}`);
      }
      if (res.timeline) {
        state.dailyStats = res.timeline;
        clearGraphMessage();
        updateChartData(res.timeline, countryCode);
      }
    })
    .catch((e) => new Error(e.message));
};

const addTailToLabels = (tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    if (dataset.label.includes(tail)) return;
    dataset.label += tail;
  });

const removeTailFromLabels = (tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    const tailIndex = dataset.label.indexOf(tail);
    if (tailIndex > 0) dataset.label = dataset.label.substring(0, tailIndex);
  });

const handleListClick = (event) => {
  const target = event.target.parentElement;
  const { CountryCode } = target.dataset;

  if (!target.classList.contains('list__row')) return;
  const countryIsSelected = !target.classList.contains('list__row_active');
  if (!countryIsSelected) {
    state.countryCode = null;
    state.dailyStats = null;
    updateChartData(worldDailyStats);
    clearGraphMessage();
  }
  if (countryIsSelected) {
    state.countryCode = CountryCode;
    handleCountrySelection(CountryCode);
  }
};

const handleButtonAbsClick = () => {
  const activeRow = getActiveListRow();
  const absoluteOn = !indicator.value.includes('100k');
  if (!absoluteOn) addTailToLabels(' per 100k');
  if (absoluteOn) removeTailFromLabels(' per 100k');

  if (activeRow) handleCountrySelection(activeRow.dataset.CountryCode);
  if (!activeRow) updateChartData(worldDailyStats);
};

const handleIndicatorChange = () => {
  const countryIsSelected = document.querySelector('.list__row_active');
  if (!countryIsSelected) {
    setTimeout(() => {
      updateChartData(worldDailyStats);
    }, 0);
  }
  if (countryIsSelected) {
    setTimeout(() => handleCountrySelection(countryIsSelected.dataset.CountryCode), 0);
  }

  const absoluteOn = !indicator.value.includes('100k');
  if (!absoluteOn) addTailToLabels(' per 100k');
  else removeTailFromLabels(' per 100k');
};

const handleTimeframeChange = (event) => {
  const { dailyStats, countryCode } = state;
  const { value } = event.target;
  const isCountrySelected = Boolean(state.countryCode);

  state.timeframe = value;
  if (isCountrySelected) {
    updateChartData(dailyStats, countryCode);
  } else {
    updateChartData(worldDailyStats);
  }
};

const setGraphSize = (style) => {
  const { scales, title, legend } = chart.options;
  const isFull = style === 'full';

  scales.xAxes[0].display = !!isFull;
  scales.yAxes[0].ticks.fontSize = isFull ? 12 : 10;
  title.fontSize = isFull ? 20 : 16;
  legend.labels.fontSize = isFull ? 12 : 10;
  legend.position = isFull ? 'bottom' : 'right';
};

const observer = new ResizeObserver((entries) => {
  Object.values(entries).forEach((entry) => {
    const { width } = entry.contentRect;
    if (width < 600) setGraphSize('compact');
    if (width >= 600) setGraphSize('full');
  });
});

export const setGraphTheme = (theme) => {
  const { xAxes, yAxes } = chart.options.scales;
  const isDayTheme = theme === 'day';
  const setRgba = (n, alpha) => `rgba(${n}, ${n}, ${n}, ${alpha})`;

  Chart.defaults.global.defaultFontColor = isDayTheme ? setRgba(0, 0.7) : setRgba(255, 0.7);
  xAxes[0].gridLines.color = isDayTheme ? setRgba(0, 0.15) : setRgba(255, 0.1);
  yAxes[0].gridLines.color = xAxes[0].gridLines.color;
  xAxes[0].ticks.fontColor = isDayTheme ? setRgba(0, 0.5) : setRgba(255, 0.5);
  yAxes[0].ticks.fontColor = xAxes[0].ticks.fontColor;
  chart.data.datasets[2].pointBackgroundColor = isDayTheme ? setRgba(0, 0.8) : setRgba(255, 0.4);
  chart.data.datasets[5].pointBackgroundColor = isDayTheme ? setRgba(0, 0.4) : setRgba(255, 0.8);

  chart.update();
};

chart.data.datasets.forEach((el, index) => {
  const dataset = el;
  dataset.pointBorderColor = 'rgba(0, 0, 0, 0)';
  dataset.borderColor = dataset.pointBackgroundColor;
  dataset.borderWidth = 1;
  dataset.pointRadius = 2;
  dataset.pointHoverRadius = 6;
  dataset.backgroundColor = 'rgba(0, 0, 0, 0)';
  if (index > 2) dataset.hidden = true;
});

listContainer.addEventListener('click', handleListClick);
buttonAbs.addEventListener('click', handleButtonAbsClick);
indicator.addEventListener('change', handleIndicatorChange);
graphTimeframeSelect.addEventListener('change', handleTimeframeChange);
observer.observe(document.querySelector('.graph'));
