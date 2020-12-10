import { getSummary, getCountries } from './CovidData.js';

const divDeaths = document.querySelector('.table-deaths');
const divRecovered = document.querySelector('.table-recovered');
const divCases = document.querySelector('.table-cases');

getSummary()
  .then((res) => {
    divCases.innerText = res.Global.TotalConfirmed;
    divDeaths.innerText = res.Global.TotalDeaths;
    divRecovered.innerText = res.Global.TotalRecovered;
  });
