/* eslint-disable no-undef */
import { getWorldStatsByDay, getCountryStatsByDay } from './CovidData.js';
import { buttonAbs } from './table.js';
import { list, indicator } from './list.js';

const canvas = document.querySelector('#chart');

const newCasesByDay = (totalCasesByDay) => {
  const cases = Object.values(totalCasesByDay);
  return cases.map((el, index) => {
    if (index === 0) return el;
    return el - Object.values(totalCasesByDay)[index - 1];
  });
};

const casesPer100k = (casesByDay, population) => casesByDay
  .map((el) => ((el / population) * 100000).toFixed(2));

const updateChartData = (chart, data, countryCode) => {
  const { cases, recovered, deaths } = data;
  const { datasets } = chart.data;
  const { options } = chart;
  const worldPopulation = 7827000000;
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

const handleCountrySelection = (graph, countryCode) => {
  getCountryStatsByDay(countryCode)
    .then((res) => {
      const chart = graph;
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
      if (res.timeline) updateChartData(chart, res.timeline, countryCode);
    })
    .catch((e) => new Error(e.message));
};

const addTailToLabels = (chart, tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    if (!dataset.label.includes(tail)) dataset.label += tail;
  });

const removeTailFromLabels = (chart, tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    const tailIndex = dataset.label.indexOf(tail);
    if (tailIndex > 0) dataset.label = dataset.label.substring(0, tailIndex);
  });

getWorldStatsByDay().then((DailyWorldStats) => {
  Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.7)';
  Chart.defaults.global.defaultFontFamily = 'Roboto';
  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: Object.keys(DailyWorldStats.cases),
      datasets: [{
        label: 'Total confirmed',
        pointBackgroundColor: '#d96459',
      }, {
        label: 'Total recovered',
        pointBackgroundColor: '#588c7e',
      }, {
        label: 'Total deaths',
        pointBackgroundColor: 'rgba(255, 255, 255, 0.4)',
      }, {
        label: 'New confirmed',
        pointBackgroundColor: '#f2ae72',
      }, {
        label: 'New recovered',
        pointBackgroundColor: '#b0cfc5',
      }, {
        label: 'New deaths',
        pointBackgroundColor: 'rgba(255, 255, 255, 0.9)',
      }],
    },
    options: {
      title: {
        display: true,
        text: 'World',
        fontSize: '20',
      },
      legend: {
        labels: {
          boxWidth: 8,
          usePointStyle: true,
        },
        position: 'bottom',
      },
      scales: {
        xAxes: [{
          gridLines: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            fontColor: 'rgba(255, 255, 255, 0.5)',
          },
        }],
        yAxes: [{
          gridLines: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            fontColor: 'rgba(255, 255, 255, 0.5)',
          },
        }],
      },
    },
  });
  chart.data.datasets.forEach((el, index) => {
    const dataset = el;
    dataset.pointBorderColor = 'rgba(0, 0, 0, 0)';
    dataset.borderColor = dataset.pointBackgroundColor;
    dataset.borderWidth = 1;
    dataset.pointRadius = 2;
    dataset.pointHoverRadius = 5;
    dataset.backgroundColor = 'rgba(0, 0, 0, 0)';
    if (index > 2) dataset.hidden = true;
  });
  updateChartData(chart, DailyWorldStats);
  chart.update();

  list.addEventListener('click', (event) => {
    const target = event.target.parentElement;
    if (!target.classList.contains('list__row')) return;
    const countryIsSelected = !target.classList.contains('list__row_active');
    if (!countryIsSelected) updateChartData(chart, DailyWorldStats);
    if (countryIsSelected) handleCountrySelection(chart, target.dataset.CountryCode);
  });

  buttonAbs.addEventListener('click', () => {
    const activeRow = document.querySelector('.list__row_active');

    if (activeRow) handleCountrySelection(chart, activeRow.dataset.CountryCode);
    if (!activeRow) updateChartData(chart, DailyWorldStats);
  });

  indicator.addEventListener('change', () => {
    const countryIsSelected = document.querySelector('.list__row_active');
    if (!countryIsSelected) setTimeout(() => updateChartData(chart, DailyWorldStats), 0);
    if (countryIsSelected) {
      setTimeout(() => handleCountrySelection(chart, countryIsSelected.dataset.CountryCode), 0);
    }

    const absoluteOn = !indicator.value.includes('100k');
    if (!absoluteOn) addTailToLabels(chart, ' per 100k');
    else removeTailFromLabels(chart, ' per 100k');
  });
});
