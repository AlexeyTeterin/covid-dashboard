import { getSummary } from './CovidData.js';
import setMap from './map.js';

const divDeaths = document.querySelector('.table-deaths');
const divRecovered = document.querySelector('.table-recovered');
const divCases = document.querySelector('.table-cases');
export const buttonCount = document.querySelector('.row-title-count');
export const buttonAbs = document.querySelector('.row-title-abs');
const buttonArea = document.querySelector('.row-title-area');

getSummary()
  .then((res) => {
    const worldPopulation = 7827000000000;
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
      if (!source) {
        divCases.innerText = 'no information';
        divDeaths.innerText = 'no information';
        divRecovered.innerText = 'no information';
        return;
      }
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
    buttonArea.addEventListener('click', async () => {
      buttonArea.innerText = 'World';
      population = worldPopulation;
      source = res.Global;
      await setStat();

      const activeListRow = document.querySelector('.list__row_active');
      const click = new Event('click', { bubbles: true });
      if (activeListRow) activeListRow.firstChild.dispatchEvent(click);
    });

    document.querySelector('.list').addEventListener('click', (e) => {
      if (!e.path[1].dataset.Country) return;
      source = res.Countries.find((a) => a.CountryCode === e.path[1].dataset.CountryCode);
      buttonArea.innerText = source.Country;
      population = source.Premium.CountryStats.Population;
      setStat();

    document.querySelector('.map').addEventListener('click', () => {
      function setSource() {
        source = res.Countries.find((a) => a.Country === buttonArea.innerText);
        if (source) population = source.Premium.CountryStats.Population;
        setStat();
      }
      setTimeout(setSource, 10);
    });

    setStat();
    setMap(res, setStat());
  });
