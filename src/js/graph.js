import Chart from 'chart.js';
import { getWorldStatsByDay, getCountryStatsByDay } from './CovidData.js';
import { buttonAbs } from './table.js';
import { list, indicator } from './list.js';

const canvas = document.querySelector('#chart');
const chart = new Chart(canvas, {
  type: 'line',
  data: {
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
      // const chart = graph;
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
    if (!dataset.label.includes(tail)) dataset.label += tail;
  });

const removeTailFromLabels = (tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    const tailIndex = dataset.label.indexOf(tail);
    if (tailIndex > 0) dataset.label = dataset.label.substring(0, tailIndex);
  });

const handleListClick = (event, DailyWorldStats) => {
  const target = event.target.parentElement;
  if (!target.classList.contains('list__row')) return;
  const countryIsSelected = !target.classList.contains('list__row_active');
  if (!countryIsSelected) updateChartData(DailyWorldStats);
  if (countryIsSelected) handleCountrySelection(chart, target.dataset.CountryCode);
};

const handleButtonAbsClick = (DailyWorldStats) => {
  const activeRow = document.querySelector('.list__row_active');

  if (activeRow) handleCountrySelection(chart, activeRow.dataset.CountryCode);
  if (!activeRow) updateChartData(DailyWorldStats);
};

const handleIndicatorChange = (DailyWorldStats) => {
  const countryIsSelected = document.querySelector('.list__row_active');
  if (!countryIsSelected) setTimeout(() => updateChartData(DailyWorldStats), 0);
  if (countryIsSelected) {
    setTimeout(() => handleCountrySelection(chart, countryIsSelected.dataset.CountryCode), 0);
  }

  const absoluteOn = !indicator.value.includes('100k');
  if (!absoluteOn) addTailToLabels(' per 100k');
  else removeTailFromLabels(' per 100k');
};

Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.global.defaultFontFamily = 'Roboto';

getWorldStatsByDay()
  .then((DailyWorldStats) => {
    chart.data.labels = Object.keys(DailyWorldStats.cases);
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
    updateChartData(DailyWorldStats);
    // chart.update();

    list.addEventListener('click', (event) => handleListClick(event, DailyWorldStats));
    buttonAbs.addEventListener('click', () => handleButtonAbsClick(DailyWorldStats));
    indicator.addEventListener('change', () => handleIndicatorChange(DailyWorldStats));
  });
