import { getSummary, getCountries, getWorldStatsByDay } from './CovidData.js';

const divDeaths = document.querySelector('.table-deaths');
const divRecovered = document.querySelector('.table-recovered');
const divCases = document.querySelector('.table-cases');
const buttonCount = document.querySelector('.row-title-count');
const buttonAbs = document.querySelector('.row-title-abs');

getSummary()
  .then((res) => {
    console.log(res);
    console.log(res.Countries[140].Premium.CountryStats.Population);

    const worldPopulation = 7827000000000; // get smwhr or const?
    // default settings
    const population = worldPopulation;
    const source = res.Global;
    const stat = { world: true, total: true, absolute: true };
    let con = source.TotalConfirmed;
    let deat = source.TotalDeaths;
    let rec = source.TotalRecovered;

    function setStat() {
      let k = 1;
      if (!stat.absolute) {
        k = population / 100000;
      }
      if (stat.total) {
        con = source.TotalConfirmed;
        deat = source.TotalDeaths;
        rec = source.TotalRecovered;
      } else {
        con = source.NewConfirmed;
        deat = source.NewDeaths;
        rec = source.NewRecovered;
      }
      divCases.innerText = con / k;
      divDeaths.innerText = deat / k;
      divRecovered.innerText = rec / k;
    }

    buttonCount.addEventListener('click', () => { // total / last day
      stat.total = !stat.total;
      buttonCount.innerText = stat.total ? 'Total' : 'Last day';
      setStat();
    });

    buttonAbs.addEventListener('click', () => { // absolute / per 100
      stat.absolute = !stat.absolute;
      buttonAbs.innerText = stat.absolute ? 'absolute' : 'per 100k'; // get area & stats
      setStat();
    });

    /* buttonArea.addEventListener('click', () => {
      stat.world = !stat.world;
      if (stat.world) {
        buttonArea.innerText = 'word';
        population = worldPopulation;
        source = res.Global;
      } else {
        const countryNumber = 140; // need to get it
        buttonArea.innerText = res.Countries[`${countryNumber}`].Country;
        source = res.Countries[`${countryNumber}`];
        population = res.Countries[`${countryNumber}`].Premium.CountryStats.Population;
      }
      setStat();
    }); */
    setStat();
  });
