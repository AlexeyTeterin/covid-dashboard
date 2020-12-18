import { getWorldStatsByDay, getCountryStatsByDay } from './CovidData.js';

const canvas = document.querySelector('#chart');
const valueTypeSwitcher = document.querySelector('.row-title-abs');

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
  const worldPopulation = 7827000000000;
  const selectedCountry = document.querySelector('.list__row_active');
  const population = countryCode ? selectedCountry.dataset.population : worldPopulation;
  const relativeValues = valueTypeSwitcher.classList.contains('relative');

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
    .catch((e) => console.log(e));
};

const addTailToLabels = (chart, tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    dataset.label += tail;
  });

const removeTailFromLabels = (chart, tail) => chart.data.datasets
  .forEach((el) => {
    const dataset = el;
    const tailIndex = dataset.label.indexOf(tail);
    if (tailIndex > 0) dataset.label = dataset.label.substring(0, tailIndex);
  });

getWorldStatsByDay().then((DailyWorldStats) => {
  Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.7)';
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
        pointBackgroundColor: 'black',
      }, {
        label: 'New confirmed',
        pointBackgroundColor: '#f2ae72',
      }, {
        label: 'New recovered',
        pointBackgroundColor: '#b0cfc5',
      }, {
        label: 'New deaths',
        pointBackgroundColor: 'rgba(0, 0, 0, 0.6)',
      }],
    },
    options: {
      title: {
        display: true,
        text: 'World',
      },
      legend: {
        labels: {
          boxWidth: 8,
          usePointStyle: true,
        },
      },
      scales: {
        xAxes: [{
          gridLines: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        }],
        yAxes: [{
          gridLines: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        }],
      },
    },
  });
  chart.data.datasets.forEach((el, index) => {
    const dataset = el;
    dataset.pointRadius = 1;
    dataset.pointHoverRadius = 2.5;
    dataset.backgroundColor = 'rgba(0, 0, 0, 0)';
    if (index > 2) dataset.hidden = true;
  });
  updateChartData(chart, DailyWorldStats);
  chart.update();

  document.querySelector('.list').addEventListener('click', (event) => {
    const target = event.target.parentElement;
    if (!target.classList.contains('list__row')) return;
    const countryIsSelected = !target.classList.contains('list__row_active');
    if (!countryIsSelected) updateChartData(chart, DailyWorldStats);
    if (countryIsSelected) handleCountrySelection(chart, target.dataset.CountryCode);
  });

  valueTypeSwitcher.addEventListener('click', () => {
    const activeRow = document.querySelector('.list__row_active');
    const tail = ' per 100k';
    const tailsOn = chart.data.datasets[0].label.indexOf(tail) > 0;

    if (!tailsOn) {
      addTailToLabels(chart, tail);
    } else {
      removeTailFromLabels(chart, tail);
    }

    if (activeRow) handleCountrySelection(chart, activeRow.dataset.CountryCode);
    if (!activeRow) updateChartData(chart, DailyWorldStats);
  });
});
