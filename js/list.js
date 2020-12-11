import { getSummary } from './CovidData.js';
import { getCountries } from './CovidData.js';

const createOptions = (data) => Object.keys(data.Global);

const calcValuesPer100k = (data, country) => {
  const result = {};
  Object.keys(data.Global).forEach((opt) => {
    const population = country.Premium.CountryStats.Population;
    let valuePer100k = ((country[opt] / population) * 100000);
    if (Number.isNaN(valuePer100k)) valuePer100k = 0;
    result[`${opt}Per100k`] = valuePer100k.toFixed(2);
  });
  return result;
};

const loadRows = (data, option) => {
  data.Countries.forEach((country) => {
    const row = document.createElement('div');
    row.classList.add('list__row');
    const name = document.createElement('div');
    const value = document.createElement('div');
    name.textContent = country.Country;
    value.textContent = country[option];

    Object.assign(row.dataset, country, calcValuesPer100k(data, country));

    row.append(name, value);
    document.querySelector('.list').append(row);
  });
};

const sortRows = (option) => {
  const rows = document.querySelectorAll('.list__row');
  const rowsSorted = Array.from(rows).sort((a, b) => {
    const firtNum = parseFloat(a.dataset[option], 10);
    const secondNum = parseFloat(b.dataset[option], 10);
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

const splitWords = (string) => {
  let result = string;
  const words = ['Confirmed', 'Deaths', 'Recovered', 'Per', '100k'];
  words.forEach((word) => {
    const index = result.indexOf(word);
    if (index < 0) return;
    result = `${result.slice(0, index)} ${result.slice(index, result.length)}`;
  });
  return result;
};

getSummary()
  .then((data) => {
    const options = createOptions(data);
    options.forEach((opt) => options.push(`${opt}Per100k`));
    options.forEach((option) => {
      const selectOption = document.createElement('option');
      selectOption.value = option;
      selectOption.textContent = splitWords(option);

      indicator.appendChild(selectOption);
      if (option === 'TotalConfirmed') selectOption.setAttribute('selected', true);
    });

    indicator.addEventListener('change', () => sortRows(indicator.value));

    loadRows(data, 'TotalConfirmed');
    sortRows('TotalConfirmed');
  })
  .catch((e) => console.log(e));
