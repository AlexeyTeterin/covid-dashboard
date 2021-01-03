/* eslint-disable no-underscore-dangle */

import { list, indicator, basicIndicators } from './list.js';

/* eslint-disable no-undef */
const mapURL = 'https://api.mapbox.com/styles/v1/pavlovalisa/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
const mapOptions = {
  attribution: '',
  maxZoom: 18,
  minZoom: 2,
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
  let geoJson;
  const listRows = Array.from(list.querySelectorAll('.list__row'));
  const map = L.map('mapid').setView([40, 20], 2);
  const info = L.control();
  const southWest = L.latLng(-60, -180);
  const northEast = L.latLng(85, 180);
  const bounds = L.latLngBounds(southWest, northEast);
  const request = new XMLHttpRequest();
  const handleMapEvents = {
    countryClick(e) {
      const { name } = e.target.feature.properties;
      if (res.find((a) => a.country === name)) {
        const clickEvent = new Event('click', { bubbles: true });
        const targetRow = listRows
          .filter((row) => row.firstChild.textContent === name)[0];
        if (targetRow) {
          targetRow.firstChild.dispatchEvent(clickEvent);
        }
      }
    },
    countryMouseOver(e) {
      const layer = e.target;
      layer.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.5,
      });
      info.update(layer.feature.properties);
    },
    countryMouseOut(e) {
      if (clickedCountry.target !== e.target) {
        geoJson.resetStyle(e.target);
      }
      info.update();
    },
    listClick(e) {
      const targetRow = e.target.parentElement;
      if (!targetRow.dataset.Country) return;
      const clickedListName = res
        .find((a) => a.country === targetRow.dataset.Country).country;
      if (clickedCountry.target) geoJson.resetStyle(clickedCountry.target);
      if (clickedListName === clickedCountry.name) {
        clickedCountry.name = '';
        clickedCountry.target = null;
        return;
      }
      const target = geoJson._layers[Object.keys(geoJson._layers)
        .find((key) => geoJson._layers[key].feature.properties.name === clickedListName)];
      if (!target) return;
      clickedCountry.name = clickedListName;
      clickedCountry.target = target;
      target.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.5,
      });
    },
  };

  request.open('GET', './assets/json/countries.json');
  request.onload = () => {
    const collection = JSON.parse(request.responseText);

    L.tileLayer(mapURL, mapOptions).addTo(map);
    map.setMaxBounds(bounds);
    basicIndicators.forEach((key) => setMaxStat(key));

    info.onAdd = function add() {
      this.div = L.DomUtil.create('div', 'info');
      this.update();
      return this.div;
    };

    info.update = function update(e) {
      let country = false;
      if (e) country = Array.from(document.querySelectorAll('.list__row')).find((row) => row.dataset.Country === e.name) || null;
      let stats = country ? country.dataset[infoType.type] : 'no information';
      if (!infoType.absolute && country) {
        stats = (stats / (country.dataset.population / 100000)).toFixed(2);
      }
      this.div.innerHTML = `<b>Covid statistics</b><br/>${e
        ? `<b>${e.name}</b><br/>${labelsArr[keysArr.indexOf(infoType.type)]} ${infoType.absolute ? '' : 'per 100k'}:<br/> ${stats}`
        : 'Hover over a country'}`;
    };

    info.addTo(map);

    function getColor(name) {
      const rows = Array.from(list.querySelectorAll('.list__row'));
      const country = res.find((c) => c.country === name);
      if (!country) { return ''; }
      const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
        '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
      ];
      const per100 = infoType.absolute ? 1 : country.population / 100000;
      // console.log(per100);
      const stat = infoType.absolute ? maxStat[infoType.type] : maxStat[`${infoType.type}Per100`];
      // console.log(stat);
      const k = rows
        .find((row) => row.dataset.Country === country.country)
        .dataset[infoType.type] / per100;
      // console.log(k, country);
      let level = stat / 8;
      if (level > 1000) level = Math.round(level / 1000) * 1000;
      else level = level.toFixed(3);
      let a = Math.floor((stat - k) / level);
      a = a > 7 ? 7 : a;
      return colors[a < 0 ? 0 : a];
    }

    function setColors() {
      Object.keys(geoJson._layers).forEach((key) => {
        geoJson._layers[key].options
          .fillColor = getColor(geoJson._layers[key].feature.properties.name);
        geoJson._layers[key].setStyle({});
      });

      const label = document.querySelector('div.info.legend.leaflet-control');
      label.innerHTML = '';
      let level = maxStat[`${infoType.type}${infoType.absolute ? '' : 'Per100'}`] / 8;
      if (level > 1000) level = Math.round(level / 1000) * 1000;
      else level = level.toFixed(0);
      const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
        '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
      ].reverse();
      colors.forEach((color, i) => {
        const value = (num) => Math.round(level * num * 1000) / 1000;
        label.innerHTML += `<i style="background:${color}"></i> ${value(i)}${colors[i + 1] ? `&ndash;${value(i + 1)}<br>` : '+'}`;
      });
    }

    function setLabel(e) {
      if (e.value) {
        if (infoType === e.value.replace('Per100k', '') && (!infoType.absolute === e.value.includes('Per100k'))) return;
        infoType.absolute = !e.value.includes('Per100k');
        infoType.type = e.value.replace('Per100k', '');
        setColors();
      }
    }
    indicator.addEventListener('click', (e) => setLabel(e.target));
    list.addEventListener('click', handleMapEvents.listClick);
    document.querySelector('.row-title-count').addEventListener('click', () => setLabel(document.querySelector('#list__indicator')));
    document.querySelector('.row-title-abs').addEventListener('click', () => setLabel(document.querySelector('#list__indicator')));
    document.querySelector('.map-wrapper > .max-min-btn').addEventListener('click', () => setTimeout(() => map.invalidateSize(true), 250));

    function style(feature) {
      return {
        fillColor: getColor(feature.properties.name),
        weight: 1,
        opacity: 1,
        color: '',
        dashArray: '3',
        dashOpacity: 0.1,
        fillOpacity: 0.3,
      };
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: handleMapEvents.countryMouseOver,
        mouseout: handleMapEvents.countryMouseOut,
        click: handleMapEvents.countryClick,
      });
    }
    geoJson = L.geoJson(collection, {
      style,
      onEachFeature,
    }).addTo(map);

    // legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function add() {
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

    legend.addTo(map);
  };

  request.send();
}
