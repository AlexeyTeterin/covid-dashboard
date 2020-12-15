import { getSummary } from './CovidData.js';
import { getCountries } from './CovidData.js';

getSummary()
  .then((res) => console.log(res.Global.TotalConfirmed));

// getCountries()
// .then((res) => console.log(res));
