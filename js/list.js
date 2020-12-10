import { getSummary } from './CovidData.js';
import { getCountries } from './CovidData.js';

const loadRows = (data, option) => {
  data.Countries.forEach((country) => {
    const row = document.createElement('div');
    row.classList.add('list__row');
    const name = document.createElement('div');
    const value = document.createElement('div');
    name.textContent = country.Country;
    value.textContent = country[option];
    Object.assign(row.dataset, country);

    row.append(name, value);
    document.querySelector('.list').append(row);
  });
};

const sortRows = (option) => {
  const rows = document.querySelectorAll('.list__row');
  const rowsSorted = Array.from(rows).sort((a, b) => {
    const firtNum = parseInt(a.dataset[option], 10);
    const secondNum = parseInt(b.dataset[option], 10);
    if (firtNum > secondNum) return -1;
    if (firtNum < secondNum) return 1;
    return 0;
  });
  rows.forEach((row) => {
    row.style.setProperty('order', rowsSorted.indexOf(row));
    const value = row.children[1];
    value.textContent = row.dataset[option];
  });
};

const indicator = document.querySelector('.list__indicator');

getSummary()
  .then((data) => {
    const options = Object.keys(data.Global);

    indicator.addEventListener('change', () => sortRows(indicator.value));
    options.forEach((option) => {
      const selectOption = document.createElement('option');
      selectOption.textContent = option;
      indicator.appendChild(selectOption);
      if (option === 'TotalConfirmed') selectOption.setAttribute('selected', true);
    });

    loadRows(data, 'TotalConfirmed');
    sortRows('TotalConfirmed');
  })
  .catch((e) => console.log(e.message));
