export async function getSummary() {
  const token = { 'X-Access-Token': '5cf9dfd5-3449-485e-b5ae-70a60e997864' };
  const response = await fetch('https://api.covid19api.com/summary', { headers: token });
  const data = await response.json();
  return data;
}

export async function getCountries() {
  const response = await fetch('https://api.covid19api.com/countries');
  const data = await response.json();
  return data;
}

export async function getWorldStatsByDay() {
  const response = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=all');
  const data = await response.json();
  return data;
}
