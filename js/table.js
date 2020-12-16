import { getSummary } from './CovidData.js';

const divDeaths = document.querySelector('.table-deaths');
const divRecovered = document.querySelector('.table-recovered');
const divCases = document.querySelector('.table-cases');
const buttonCount = document.querySelector('.row-title-count');
const buttonAbs = document.querySelector('.row-title-abs');
const buttonArea = document.querySelector('.row-title-area');

getSummary()
  .then((res) => {
    const worldPopulation = 7827000000000; // get smwhr or const?
    // default settings
    let population = worldPopulation;
    let source = res.Global;
    const stat = { world: true, total: true, absolute: true };
    let con = source.TotalConfirmed;
    let deat = source.TotalDeaths;
    let rec = source.TotalRecovered;
    function round(n) {
      return Math.round(n * 100) / 100;
    }
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
      divCases.innerText = round(con / k);
      divDeaths.innerText = round(deat / k);
      divRecovered.innerText = round(rec / k);
    }

    buttonCount.addEventListener('click', () => { // total / last day
      stat.total = !stat.total;
      buttonCount.innerText = stat.total ? 'Total' : 'Last day';
      setStat();
    });

    buttonAbs.addEventListener('click', () => { // absolute / per 100
      stat.absolute = !stat.absolute;
      buttonAbs.innerText = stat.absolute ? 'absolute' : 'per 100k';
      setStat();
    });
    buttonArea.addEventListener('click', () => {
      buttonArea.innerText = 'World';
      population = worldPopulation;
      source = res.Global;
      setStat();
    });
    document.querySelectorAll('.list__row').forEach((l) => l.addEventListener('click', (e) => {
      source = res.Countries.find((a) => a.CountryCode === e.path[1].dataset.CountryCode);
      buttonArea.innerText = source.Country;
      population = source.Premium.CountryStats.Population;
      setStat();
    }));

    setStat();
  });
