import { getSummary } from './CovidData.js';
import { getCountries } from './CovidData.js';

getSummary()
  .then((res) => console.log(res));

// getCountries()
//   .then((res) => console.log(res));
