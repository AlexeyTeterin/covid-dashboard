import Chart from 'chart.js';
import { getWorldStatsByDay, getCountryStatsByDay } from './CovidData';
import { buttonAbs, globalStats } from './table';
import { list, indicator } from './list';
import graphSettings from './graphSettings';

const canvas = document.querySelector('#chart');
const chart = new Chart(canvas, graphSettings);

let dailyStats;

const newCasesByDay = (totalCasesByDay) => {
  const cases = Object.values(totalCasesByDay);
  return cases.map((el, index) => {
    if (index === 0) return el;
    return el - Object.values(totalCasesByDay)[index - 1];
  });
};

const casesPer100k = (casesByDay, population) => casesByDay
  .map((el) => ((el / population) * 100000).toFixed(2));

const updateChartData = (data, countryCode) => {
  const { cases, recovered, deaths } = data;
  const { datasets } = chart.data;
  const { options } = chart;
  const worldPopulation = globalStats.population || localStorage.worldPopulation || 7798000000;
  localStorage.worldPopulation = worldPopulation;
  const selectedCountry = document.querySelector('.list__row_active');
  const population = countryCode ? selectedCountry.dataset.population : worldPopulation;
  const relativeValues = buttonAbs.classList.contains('relative');

  datasets[0].data = Object.values(cases);
  datasets[1].data = Object.values(recovered);
  datasets[2].data = Object.values(deaths);
  datasets[3].data = newCasesByDay(cases);
  datasets[4].data = newCasesByDay(recovered);
  datasets[5].data = newCasesByDay(deaths);
  if (relativeValues) {
    datasets.forEach((el) => {
      const dataset = el;
      dataset.data = casesPer100k(dataset.data, population);
    });
  }
  if (!countryCode) options.title.text = 'World';
  chart.update();
};

const handleCountrySelection = (countryCode) => {
  getCountryStatsByDay(countryCode)
    .then((res) => {
      const activeRow = document.querySelector('.list__row_active');
      const countryName = activeRow.dataset.Country;
      chart.options.title.text = countryName;
      if (!res.timeline) {
        chart.data.datasets.forEach((el) => {
          const dataset = el;
          dataset.data = [];
        });
        chart.update();
      }
      if (res.timeline) updateChartData(res.timeline, countryCode);
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
  if (!target.classList.contains('list__row')) return;
  const countryIsSelected = !target.classList.contains('list__row_active');
  if (!countryIsSelected) updateChartData(dailyStats);
  if (countryIsSelected) handleCountrySelection(target.dataset.CountryCode);
};

const handleButtonAbsClick = () => {
  const activeRow = document.querySelector('.list__row_active');
  const absoluteOn = !indicator.value.includes('100k');
  if (!absoluteOn) addTailToLabels(' per 100k');
  if (absoluteOn) removeTailFromLabels(' per 100k');

  if (activeRow) handleCountrySelection(activeRow.dataset.CountryCode);
  if (!activeRow) updateChartData(dailyStats);
};

const handleIndicatorChange = () => {
  const countryIsSelected = document.querySelector('.list__row_active');
  if (!countryIsSelected) setTimeout(() => updateChartData(dailyStats), 0);
  if (countryIsSelected) {
    setTimeout(() => handleCountrySelection(countryIsSelected.dataset.CountryCode), 0);
  }

  const absoluteOn = !indicator.value.includes('100k');
  if (!absoluteOn) addTailToLabels(' per 100k');
  else removeTailFromLabels(' per 100k');
};

const setGraphSize = (style) => {
  const { scales, title, legend } = chart.options;
  const isFull = style === 'full';
    
  scales.xAxes[0].display = isFull ? true : false;
  scales.yAxes[0].ticks.fontSize = isFull ? 12 : 10;
  title.fontSize = isFull ? 20 : 16;
  legend.labels.fontSize = isFull ? 12 : 10;
  legend.position = isFull ? 'bottom' : 'right';
}

const observer = new ResizeObserver((entries) => {
  Object.values(entries).forEach((entry) => {
    const { width } = entry.contentRect;
    console.log(width)
    if (width < 600) setGraphSize('compact');
    if (width >= 600) setGraphSize('full');
  });
});

export const setGraphTheme = (theme) => {
  const { scales } = chart.options;
  
  if (theme === 'day') {
    Chart.defaults.global.defaultFontColor = 'rgba(0, 0, 0, 0.7)';
    scales.xAxes[0].gridLines.color = 'rgba(0, 0, 0, 0.15)';
    scales.yAxes[0].gridLines.color = 'rgba(0, 0, 0, 0.15)';
    scales.xAxes[0].ticks.fontColor = 'rgba(0, 0, 0, 0.5)';
    scales.yAxes[0].ticks.fontColor = 'rgba(0, 0, 0, 0.5)';
    chart.data.datasets[2].pointBackgroundColor = 'rgba(0, 0, 0, 0.8)';
    chart.data.datasets[5].pointBackgroundColor = 'rgba(0, 0, 0, 0.4)';
  } else {
    Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.7)';
    scales.xAxes[0].gridLines.color = 'rgba(255, 255, 255, 0.1)';
    scales.yAxes[0].gridLines.color = 'rgba(255, 255, 255, 0.1)';
    scales.xAxes[0].ticks.fontColor = 'rgba(255, 255, 255, 0.5)';
    scales.yAxes[0].ticks.fontColor = 'rgba(255, 255, 255, 0.5)';
    chart.data.datasets[2].pointBackgroundColor = 'rgba(255, 255, 255, 0.4)';
    chart.data.datasets[5].pointBackgroundColor = 'rgba(255, 255, 255, 0.9)';
  }

  chart.update();
}

Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.global.defaultFontFamily = 'Roboto';
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

list.addEventListener('click', handleListClick);
buttonAbs.addEventListener('click', handleButtonAbsClick);
indicator.addEventListener('change', handleIndicatorChange);
observer.observe(document.querySelector('.graph'));

getWorldStatsByDay()
  .then((result) => {
    dailyStats = result;
    chart.data.labels = Object.keys(dailyStats.cases);
    updateChartData(dailyStats);
  });
