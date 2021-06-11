export const globalStats = {};

export const globalDailyStats = {};

export const setGlobalStats = (worldStats) => {
  Object.assign(globalStats, {
    population: worldStats.population,
    NewConfirmed: worldStats.todayCases,
    TotalConfirmed: worldStats.cases,
    NewDeaths: worldStats.todayDeaths,
    TotalDeaths: worldStats.deaths,
    NewRecovered: worldStats.todayRecovered,
    TotalRecovered: worldStats.recovered,
  });
};

export async function getWorldStatsByDay() {
  const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=720');
  const data = await response.json();
  return data;
}

export async function getCountryStatsByDay(countryCode) {
  const response = await fetch(`https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=all`);
  const data = await response.json();
  return data;
}

export async function getWorldStats() {
  const response = await fetch('https://disease.sh/v3/covid-19/all?yesterday=true&twoDaysAgo=false&allowNull=false');
  const data = await response.json();
  return data;
}

export async function getAllCountriesStats() {
  const response = await fetch('https://disease.sh/v3/covid-19/countries?yesterday=true&twoDaysAgo=false&allowNull=false');
  const data = await response.json();
  return data;
}

export async function getAllData() {
  return Promise.all([getWorldStats(), getWorldStatsByDay(), getAllCountriesStats()]);
}

export const getFlagURL = (countryCode) => `url(https://www.countryflags.io/${countryCode}/shiny/24.png)`;

export const getFlagImg = async (countryCode) => {
  const responce = await fetch(`https://www.countryflags.io/${countryCode}/shiny/24.png`, {
    mode: 'no-cors',
  });
  const img = await responce.blob();
  const localURL = URL.createObjectURL(img).substr(5);
  return `url(${localURL})`;
};
