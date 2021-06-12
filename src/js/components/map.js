/* eslint-disable no-underscore-dangle */
import * as Leaflet from 'leaflet';
import { geoJson } from 'leaflet';
import {
  buttonAbs,
  buttonCount,
  getListRows,
  indicator,
  listContainer,
} from '../dom';
import { countrySelectStyle, mapParams, mapSettings, mapURL } from './mapSettings';
import { basicIndicators, MESSAGES } from '../constants';
import { allCountriesStats } from '../model';
import countries from '../../assets/json/countries.json';

const maxStat = {};
const setMaxStat = (key) => {
  let max = 0;
  let maxPer100 = 0;
  getListRows()
    .forEach((listRow) => {
      const value = listRow.dataset[key];
      const valuePer100k = value / (listRow.dataset.population / 100000);
      if (max < value) max = +value;
      if (maxPer100 < valuePer100k) maxPer100 = +valuePer100k;
    });
  maxStat[key] = max / 5;
  maxStat[`${key}Per100`] = (maxPer100 / 5);
};
const keysArr = basicIndicators.slice();
const labelsArr = keysArr
  .map((el) => el.replace('New', 'New ').replace('Total', 'Total '));

const infoType = { type: 'TotalConfirmed', absolute: true };

const map = Leaflet.map('mapid');
const mapInfo = Leaflet.control();
const mapLegend = Leaflet.control({ position: 'bottomright' });
const southWest = Leaflet.latLng(-90, -220);
const northEast = Leaflet.latLng(90, 220);

const mapEvents = {
  clickedCountry: { target: null, name: '' },

  onCountryClick(e) {
    const { id } = e.target.feature;
    const targetCountry = allCountriesStats
      .find((country) => country.countryInfo.iso3 === id);
    if (targetCountry) {
      const clickEvent = new Event('click', { bubbles: true });
      const targetRow = Array.from(getListRows())
        .find((row) => row.dataset.id === id);
      if (targetRow) targetRow.firstChild.dispatchEvent(clickEvent);
    }
  },

  onCountryMouseOver({ target }) {
    const { name } = target.feature.properties;

    target.setStyle(countrySelectStyle);
    mapInfo.update(name);
  },

  onCountryMouseOut({ target }) {
    if (this.clickedCountry.target !== target) geoJson.resetStyle(target);
    mapInfo.update();
  },

  onListClick(e) {
    const targetRow = e.target.parentElement;
    if (!targetRow.dataset.Country) return;

    const targetCountryName = targetRow.dataset.Country;
    const { lat, long } = allCountriesStats
      .find((country) => country.country === targetCountryName).countryInfo;
    const targetCoordinates = Leaflet.latLng(lat, long);
    const targetLayer = geoJson._layers[Object.keys(geoJson._layers)
      .find((key) => geoJson._layers[key].feature.properties.name === targetCountryName)];
    const clickedListName = allCountriesStats
      .find((a) => a.country === targetRow.dataset.Country).country;
    const selectionRemoved = clickedListName === this.clickedCountry.name;

    if (this.clickedCountry.target) geoJson.resetStyle(this.clickedCountry.target);

    if (selectionRemoved) {
      map.setView([40, 20], 2);
      this.clickedCountry.name = '';
      this.clickedCountry.target = null;
      return;
    }

    map.setView(targetCoordinates, 3);
    this.clickedCountry.name = clickedListName;
    this.clickedCountry.target = targetLayer;

    if (!targetLayer) return;
    targetLayer.setStyle(countrySelectStyle);
  },
};

const getColor = (countryName) => {
  const actualCountry = allCountriesStats.find(({ country }) => country === countryName);
  if (!actualCountry) return '';

  const rows = Array.from(getListRows());
  const { absolute, type } = infoType;
  const per100 = absolute ? 1 : actualCountry.population / 100000;
  const stat = absolute ? maxStat[type] : maxStat[`${type}Per100`];
  const k = rows
    .find(({ dataset }) => dataset.Country === actualCountry.country)
    .dataset[type] / per100;
  let level = stat / 8;
  if (level > 1000) level = Math.round(level / 1000) * 1000;
  else level = level.toFixed(3);
  let a = Math.floor((stat - k) / level);
  a = a > 7 ? 7 : a;
  return mapSettings.colors[a < 0 ? 0 : a];
};

const setColors = () => {
  const colors = mapSettings.colors.reverse();
  const label = document.querySelector('div.info.legend.leaflet-control');
  const { _layers } = geoJson;
  let level = maxStat[`${infoType.type}${infoType.absolute ? '' : 'Per100'}`] / 8;

  Object.keys(_layers).forEach((key) => {
    _layers[key].options
      .fillColor = getColor(_layers[key].feature.properties.name);
    _layers[key].setStyle({});
  });

  label.innerHTML = '';
  if (level > 1000) level = Math.round(level / 1000) * 1000;
  else level = level.toFixed(0);
  colors.forEach((color, i) => {
    const value = (num) => Math.round(level * num * 1000) / 1000;
    label.innerHTML += `<i style="background:${color}"></i> ${value(i)}${colors[i + 1] ? `&ndash;${value(i + 1)}<br>` : '+'}`;
  });
};

const setLabel = (labelName) => {
  if (!labelName) return;

  infoType.absolute = !labelName.includes('Per100k');
  infoType.type = labelName.replace('Per100k', '');
  setColors();
};

const setCountryStyle = (feature) => ({
  fillColor: getColor(feature.properties.name),
  weight: 1,
  opacity: mapSettings.fillOpacity,
  color: '',
  dashArray: '3',
  dashOpacity: 0.1,
  fillOpacity: 0.4,
});

const onEachFeature = (feature, layer) => {
  layer.on({
    mouseover: mapEvents.onCountryMouseOver.bind(mapEvents),
    mouseout: mapEvents.onCountryMouseOut.bind(mapEvents),
    click: mapEvents.onCountryClick.bind(mapEvents),
  });
};

const runEventListeners = () => {
  indicator.addEventListener('click', ({ target }) => setLabel(target.value));
  listContainer.addEventListener('click', mapEvents.onListClick.bind(mapEvents));
  buttonCount.addEventListener('click', () => setLabel(indicator.value));
  buttonAbs.addEventListener('click', () => setLabel(indicator.value));
  document.querySelector('.map-wrapper > .max-min-btn')
    .addEventListener('click', () => setTimeout(() => map.invalidateSize(true), 250));
};

const resetMap = async () => {
  map.setView([40, 20], 2);
  map.setMaxBounds(Leaflet.latLngBounds(southWest, northEast));

  basicIndicators.forEach((key) => setMaxStat(key));
  Leaflet.tileLayer(mapURL, mapParams).addTo(map);
  mapInfo.addTo(map);
  mapLegend.addTo(map);
  geoJson = Leaflet.geoJson(countries, { style: setCountryStyle, onEachFeature }).addTo(map);

  runEventListeners();
};

mapInfo.onAdd = function add() {
  this.div = Leaflet.DomUtil.create('div', 'info');
  this.update();
  return this.div;
};

mapInfo.update = function update(countryName) {
  if (!countryName) {
    this.div.innerHTML = MESSAGES.hover;
  }
  if (countryName) {
    const targetRow = Array.from(getListRows())
      .find((row) => row.dataset.Country === countryName) || null;
    const targetData = targetRow ? targetRow.dataset : {};
    const typeOfValue = labelsArr[keysArr.indexOf(infoType.type)];
    const absoluteOrRelative = infoType.absolute ? '' : 'per 100k';
    const targetCountry = targetData.Country || countryName;

    let stats = targetData[infoType.type] || MESSAGES.noInfo;
    if (!infoType.absolute && targetRow) {
      stats = (stats / (targetData.population / 100000)).toFixed(2);
    }

    this.div.innerHTML = `${typeOfValue} ${absoluteOrRelative} in <b>${targetCountry}</b>:<br/>
      ${stats}`;
  }
};

mapLegend.onAdd = function add() {
  const key = 'TotalConfirmed';
  const div = Leaflet.DomUtil.create('div', 'info legend');
  let level = Math.round(maxStat[key] / 8);
  if (level > 1000) level = Math.round(level / 1000) * 1000;
  const colors = mapSettings.colors.slice();
  colors.reverse().forEach((color, i) => {
    div.innerHTML += `<i style="background:${color}"></i> ${level * i}${colors[i + 1] ? `&ndash;${level * (i + 1)}<br>` : '+'}`;
  });
  return div;
};

export default resetMap;
