export default class CovidData {
  constructor() {
    this.summary = {};
    this.countries = {};
  }

  async getSummary() {
    const token = { 'X-Access-Token': '5cf9dfd5-3449-485e-b5ae-70a60e997864' };
    fetch('https://api.covid19api.com/summary', { headers: token })
      .then((data) => {
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      })
      .then((json) => Object.assign(this.summary, json));
    return this;
  }

  async getCountries() {
    fetch('https://api.covid19api.com/countries')
      .then((data) => {
        if (!data.ok) throw new Error(data.statusText);
        return data.json();
      })
      .then((json) => Object.assign(this.countries, json));
    return this;
  }
}
