import CovidData from './CovidData.js';

const DATA = new CovidData();
DATA.getCountries();
DATA.getSummary();

console.log(DATA);
