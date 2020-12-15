import { getWorldStatsByDay, getCountryStatsByDay } from './CovidData.js';

const canvas = document.querySelector('#chart');

const newCasesByDay = (totalCasesByDay) => {
  const cases = Object.values(totalCasesByDay);
  return cases.map((el, index) => {
    if (index === 0) return el;
    return el - Object.values(totalCasesByDay)[index - 1];
  });
};

const casesPer100k = (totalCasesByDay) => {
  const cases = Object.values(totalCasesByDay);
  return cases.map((el) => el / 78270000);
};

const graphCountryHandler = (graph, countryCode) => {
  getCountryStatsByDay(countryCode).then((res) => {
    const chart = graph;
    const activeRow = document.querySelector('.list__row_active');
    const countryName = activeRow.dataset.Country;
    chart.options.title.text = countryName;
    chart.data.datasets.forEach((dataset) => dataset.data = []);
    if (!res.timeline) return;
    const { cases, recovered, deaths } = res.timeline;
    chart.data.datasets[0].data = Object.values(cases);
    chart.data.datasets[1].data = Object.values(recovered);
    chart.data.datasets[2].data = Object.values(deaths);
    chart.data.datasets[3].data = newCasesByDay(cases);
    chart.data.datasets[4].data = newCasesByDay(recovered);
    chart.data.datasets[5].data = newCasesByDay(deaths);
    chart.update();
    console.log(res);
  });
};

getWorldStatsByDay().then((DailyWorldStats) => {
  console.log(DailyWorldStats);
  const chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: Object.keys(DailyWorldStats.cases),
      datasets: [{
        label: 'Total confirmed',
        data: Object.values(DailyWorldStats.cases),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 1,
        pointHoverRadius: 2.5,
        pointBackgroundColor: '#d96459',
      }, {
        label: 'Total recovered',
        data: Object.values(DailyWorldStats.recovered),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 1,
        pointHoverRadius: 2.5,
        pointBackgroundColor: '#588c7e',
      }, {
        label: 'Total deaths',
        data: Object.values(DailyWorldStats.deaths),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 1,
        pointHoverRadius: 2.5,
        pointBackgroundColor: 'black',
        hidden: true,
      }, {
        label: 'New confirmed',
        data: newCasesByDay(DailyWorldStats.cases),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 1,
        pointHoverRadius: 2.5,
        pointBackgroundColor: '#f2ae72',
        hidden: true,
      }, {
        label: 'New recovered',
        data: newCasesByDay(DailyWorldStats.recovered),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 1,
        pointHoverRadius: 2.5,
        pointBackgroundColor: '#b0cfc5',
        hidden: true,
      }, {
        label: 'New deaths',
        data: newCasesByDay(DailyWorldStats.deaths),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 1,
        pointHoverRadius: 2.5,
        pointBackgroundColor: 'rgba(0, 0, 0, 0.6)',
        hidden: true,
      }, {
        label: 'Total confirmed per 100k',
        data: casesPer100k(DailyWorldStats.cases),
        backgroundColor: 'rgba(0, 0, 0, 0)',
        pointRadius: 1,
        pointHoverRadius: 2.5,
        pointBackgroundColor: '#d96459',
      }],
    },
    options: {
      title: {
        display: true,
        text: 'World',
      },
      legend: {
        labels: {
          boxWidth: 12,
          usePointStyle: true,
        },
      },
    },
  });

  document.querySelector('.list').addEventListener('click', (event) => {
    const target = event.target.parentElement;
    if (!target.classList.contains('list__row')) return;
    graphCountryHandler(chart, target.dataset.CountryCode);
  });
});
