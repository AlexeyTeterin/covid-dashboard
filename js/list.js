import { getSummary } from './CovidData.js';
import { getCountries } from './CovidData.js';

getSummary().then((data) => {
  data.Countries.forEach((country) => {
    const row = document.createElement('div');
    row.classList.add('list__row');
    const name = document.createElement('div');
    const indicator = document.createElement('div');
    name.textContent = country.Country;
    indicator.textContent = country.TotalConfirmed;
    row.dataset.indicator = country.TotalConfirmed;

    row.append(name, indicator);
    document.querySelector('.list').append(row);

    document.querySelector('.indicator').textContent = 'Total Cases';
  });

  const rows = document.querySelectorAll('.list__row');
  const rowsSorted = Array.from(rows).sort((a, b) => {
    const firtNum = parseInt(a.dataset.indicator, 10);
    const secondNum = parseInt(b.dataset.indicator, 10);
    if (firtNum > secondNum) return -1;
    if (firtNum < secondNum) return 1;
    return 0;
  });
  rows.forEach((row) => row.style.setProperty('order', rowsSorted.indexOf(row)));
});
