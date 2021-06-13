import Chart from 'chart.js';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.global.defaultFontFamily = 'Roboto';

const graphSettings = {
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
      align: 'center',
    },
    scales: {
      xAxes: [{
        gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          fontColor: 'rgba(255, 255, 255, 0.5)',
          fontSize: 11,
          callback: (value) => {
            const date = new Date(value);
            const currMonth = MONTHS[date.getMonth()];
            return `${currMonth} ${date.getDate()}, ${date.getFullYear().toString().substr(2)}`;
          },
        },
      }],
      yAxes: [{
        gridLines: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: {
          fontColor: 'rgba(255, 255, 255, 0.5)',
          fontSize: 11,
          callback: (value, index, values) => {
            let delimeter = 1;
            let tail = '';
            if (Math.max(...values) > 1000) {
              tail = 'k';
              delimeter = 1000;
            }
            if (Math.max(...values) > 1000000) {
              tail = 'M';
              delimeter = 1000000;
            }
            return `${value / delimeter} ${tail}`;
          },
        },
      }],
    },
    hover: {
      intersect: false,
      mode: 'index',
      axis: 'x',
    },
    tooltips: {
      intersect: false,
      titleAlign: 'center',
      mode: 'index',
      callbacks: {
        title: (tooltipItem, data) => {
          const date = new Date(data.labels[tooltipItem[0].index]);
          return date.toDateString().substr(4);
        },
      },
    },
  },
};

export const defaultDatasetStyle = {
  pointBorderColor: 'rgba(0, 0, 0, 0)',
  borderWidth: 1,
  pointRadius: 2,
  pointHoverRadius: 6,
  backgroundColor: 'rgba(0, 0, 0, 0)',
};

export default graphSettings;
