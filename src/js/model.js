// @flow
import type { IAppGlobalStats, ICountryStats, IWorldDailyStats, IWorldStats } from './types';

export const globalStats: IAppGlobalStats = {};
export const globalDailyStats: IWorldDailyStats = {};
export const allCountriesStats: Array<ICountryStats> = [];

export const setGlobalStats = (stats: IWorldStats): void => {
  Object.assign(globalStats, {
    population: +stats.population,
    NewConfirmed: +stats.todayCases,
    TotalConfirmed: +stats.cases,
    NewDeaths: +stats.todayDeaths,
    TotalDeaths: +stats.deaths,
    NewRecovered: +stats.todayRecovered,
    TotalRecovered: +stats.recovered,
  });
};

export const setGlobalDailyStats = (stats: IWorldDailyStats): void => {
  Object.assign(globalDailyStats, stats);
};

export const setAllCountriesStats = (stats: Array<ICountryStats>): void => {
  allCountriesStats.push(...stats);
};

export async function getWorldStatsByDay(): Promise<IWorldDailyStats> {
  const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=720');
  const data = await response.json();
  return data;
}

export async function getCountryStatsByDay(countryCode: string): Promise<ICountryStats> {
  const response = await fetch(`https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=all`);
  const data = await response.json();
  return data;
}

export async function getWorldStats(): Promise<IWorldStats> {
  const response = await fetch('https://disease.sh/v3/covid-19/all?yesterday=true&twoDaysAgo=false&allowNull=false');
  const data = await response.json();
  return data;
}

export async function getAllCountriesStats(): Promise<ICountryStats> {
  const response = await fetch('https://disease.sh/v3/covid-19/countries?yesterday=true&twoDaysAgo=false&allowNull=false');
  const data = await response.json();
  return data;
}

export async function getAllData(): Promise<Array<any>> {
  return Promise.all([getWorldStats(), getWorldStatsByDay(), getAllCountriesStats()]);
}

export const getFlagURL = (countryCode: string): string => `url(https://www.countryflags.io/${countryCode}/shiny/24.png)`;

export const getFlagImg = async (countryCode: string): Promise<string> => {
  const response = await fetch(
    `https://www.countryflags.io/${countryCode}/shiny/24.png`,
    { mode: 'no-cors' },
  );
  const img = await response.blob();
  const localURL = URL.createObjectURL(img).substr(5);
  return `url(${localURL})`;
};
