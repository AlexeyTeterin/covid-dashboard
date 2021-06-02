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
