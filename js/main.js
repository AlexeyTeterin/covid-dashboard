import { getSummary, getCountries } from './CovidData.js';

getSummary()
  .then((res) => console.log(res.Global));

// getCountries()
//   .then((res) => console.log(res));
