import { getWorldStatsByDay } from './CovidData.js';

const canvas = document.querySelector('#graph');

getWorldStatsByDay().then((DailyWorldStats) => {
  console.log(DailyWorldStats);
  const graph = new Chart(canvas, {
    type: 'line',
    data: {
      labels: Object.keys(DailyWorldStats.cases),
      datasets: [{
        label: 'Total cases',
        data: Object.values(DailyWorldStats.cases),
      }, {
        label: 'Total recovered',
        data: Object.values(DailyWorldStats.recovered),
      }, {
        label: 'Total deaths',
        data: Object.values(DailyWorldStats.deaths),
      }],
    },
    options: {},
  });
});
