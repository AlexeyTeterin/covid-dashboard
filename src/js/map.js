/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

import { geoJson } from 'leaflet';
import { list, indicator, basicIndicators } from './list.js';

const mapURL = 'https://api.mapbox.com/styles/v1/pavlovalisa/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
const mapOptions = {
  attribution: '',
  maxZoom: 6,
  minZoom: 1,
  id: 'ckipuyrx61npy17nqq9rtqsd7',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoicGF2bG92YWxpc2EiLCJhIjoiY2tpcHUxaW1pMXB6cTJ4cGtmcmo1dzVtYSJ9.Wyer4Fg3gii60yxTn2cdOw',
};
const maxStat = {};
const setMaxStat = (key) => {
  let max = 0;
  let maxPer100 = 0;
  list.querySelectorAll('.list__row')
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
const clickedCountry = { target: null, name: '' };
const infoType = { type: 'TotalConfirmed', absolute: true };

export default function setMap(res) {
  const listRows = Array.from(list.querySelectorAll('.list__row'));
  const map = L.map('mapid').setView([40, 20], 2);
  const mapInfo = L.control();
  const mapLegend = L.control({ position: 'bottomright' });
  const southWest = L.latLng(-90, -220);
  const northEast = L.latLng(90, 220);
  const bounds = L.latLngBounds(southWest, northEast);
  const request = new XMLHttpRequest();
  const handleMapEvents = {
    countryClick(e) {
      const { id } = e.target.feature;
      const targetCountry = res.find((country) => country.countryInfo.iso3 === id);
      if (targetCountry) {
        const clickEvent = new Event('click', { bubbles: true });
        const targetRow = listRows.find((row) => row.dataset.id === id);
        if (targetRow) targetRow.firstChild.dispatchEvent(clickEvent);
      }
    },
    countryMouseOver(e) {
      const layer = e.target;
      layer.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.8,
      });
      mapInfo.update(layer.feature.properties.name);
    },
    countryMouseOut(e) {
      if (clickedCountry.target !== e.target) {
        geoJson.resetStyle(e.target);
      }
      mapInfo.update();
    },
    listClick(e) {
      const targetRow = e.target.parentElement;
      if (!targetRow.dataset.Country) return;

      const targetCountryName = targetRow.dataset.Country;
      const { lat, long } = res
        .find((country) => country.country === targetCountryName).countryInfo;
      const targetCoordinates = L.latLng(lat, long);
      const targetLayer = geoJson._layers[Object.keys(geoJson._layers)
        .find((key) => geoJson._layers[key].feature.properties.name === targetCountryName)];
      const clickedListName = res
        .find((a) => a.country === targetRow.dataset.Country).country;
      const selectionRemoved = clickedListName === clickedCountry.name;

      if (clickedCountry.target) geoJson.resetStyle(clickedCountry.target);

      if (selectionRemoved) {
        map.setView([40, 20], 2);
        clickedCountry.name = '';
        clickedCountry.target = null;
        return;
      }

      map.setView(targetCoordinates, 3);
      clickedCountry.name = clickedListName;
      clickedCountry.target = targetLayer;

      if (!targetLayer) return;
      targetLayer.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.8,
      });
    },
  };
  const getColor = (name) => {
    const rows = Array.from(list.querySelectorAll('.list__row'));
    const country = res.find((c) => c.country === name);
    if (!country) { return ''; }
    const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
      '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
    ];
    const per100 = infoType.absolute ? 1 : country.population / 100000;
    const stat = infoType.absolute ? maxStat[infoType.type] : maxStat[`${infoType.type}Per100`];
    const k = rows
      .find((row) => row.dataset.Country === country.country)
      .dataset[infoType.type] / per100;
    let level = stat / 8;
    if (level > 1000) level = Math.round(level / 1000) * 1000;
    else level = level.toFixed(3);
    let a = Math.floor((stat - k) / level);
    a = a > 7 ? 7 : a;
    return colors[a < 0 ? 0 : a];
  };
  const setColors = () => {
    const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
      '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
    ].reverse();
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
  const setLabel = (e) => {
    if (e.value) {
      if (infoType === e.value.replace('Per100k', '') && (!infoType.absolute === e.value.includes('Per100k'))) return;
      infoType.absolute = !e.value.includes('Per100k');
      infoType.type = e.value.replace('Per100k', '');
      setColors();
    }
  };
  const style = (feature) => ({
    fillColor: getColor(feature.properties.name),
    weight: 1,
    opacity: 0.8,
    color: '',
    dashArray: '3',
    dashOpacity: 0.1,
    fillOpacity: 0.4,
  });
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: handleMapEvents.countryMouseOver,
      mouseout: handleMapEvents.countryMouseOut,
      click: handleMapEvents.countryClick,
    });
  };
  const runEventListeners = () => {
    indicator.addEventListener('click', (event) => setLabel(event.target));
    list.addEventListener('click', handleMapEvents.listClick);
    document.querySelector('.row-title-count').addEventListener('click', () => setLabel(indicator));
    document.querySelector('.row-title-abs').addEventListener('click', () => setLabel(indicator));
    document.querySelector('.map-wrapper > .max-min-btn').addEventListener('click', () => setTimeout(() => map.invalidateSize(true), 250));
  };

  mapInfo.onAdd = function add() {
    this.div = L.DomUtil.create('div', 'info');
    this.update();
    return this.div;
  };
  mapInfo.update = function update(countryName) {
    if (!countryName) {
      this.div.innerHTML = 'Hover over a country';
    }
    if (countryName) {
      const targetRow = listRows
        .find((row) => row.dataset.Country === countryName) || null;
      const targetData = targetRow ? targetRow.dataset : {};
      const typeOfValue = labelsArr[keysArr.indexOf(infoType.type)];
      const absoluteOrRelative = infoType.absolute ? '' : 'per 100k';
      const targetCountry = targetData.Country || countryName;

      let stats = targetData[infoType.type] || 'no information';
      if (!infoType.absolute && targetRow) {
        stats = (stats / (targetData.population / 100000)).toFixed(2);
      }

      this.div.innerHTML = `<b>${targetCountry}</b><br/>
        ${typeOfValue} ${absoluteOrRelative}:<br/>
        ${stats}`;
    }
  };
  mapLegend.onAdd = function add() {
    const key = 'TotalConfirmed';
    const div = L.DomUtil.create('div', 'info legend');
    let level = Math.round(maxStat[key] / 8);
    if (level > 1000) level = Math.round(level / 1000) * 1000;
    const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
      '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
    ];
    colors.reverse().forEach((color, i) => {
      div.innerHTML += `<i style="background:${color}"></i> ${level * i}${colors[i + 1] ? `&ndash;${level * (i + 1)}<br>` : '+'}`;
    });
    return div;
  };

  request.open('GET', './assets/json/countries.json');
  request.onload = () => {
    const collection = JSON.parse(request.responseText);

    L.tileLayer(mapURL, mapOptions).addTo(map);
    map.setMaxBounds(bounds);
    basicIndicators.forEach((key) => setMaxStat(key));
    mapInfo.addTo(map);
    mapLegend.addTo(map);
    runEventListeners();

    geoJson = L.geoJson(collection, {
      style,
      onEachFeature,
    }).addTo(map);
  };

  request.send();
}
