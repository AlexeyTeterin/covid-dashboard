import { getSummary } from './CovidData.js';

getSummary().then((data) => {
  const request = new XMLHttpRequest();
  request.open('GET', './assets/json/countries.json');
  request.onload = () => {
    const collection = JSON.parse(request.responseText);

    const map = L.map('mapid').setView([0, 0], 2);
    L.tileLayer('https://api.mapbox.com/styles/v1/pavlovalisa/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      minZoom: 2,
      id: 'ckipuyrx61npy17nqq9rtqsd7',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoicGF2bG92YWxpc2EiLCJhIjoiY2tpcHUxaW1pMXB6cTJ4cGtmcmo1dzVtYSJ9.Wyer4Fg3gii60yxTn2cdOw',
    }).addTo(map);
    const southWest = L.latLng(-60, -180);
    // console.log(map.getBounds())
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    /// events and countries layout

    const info = L.control();

    info.onAdd = function (map) {
      this.div = L.DomUtil.create('div', 'info');
      this.update();
      return this.div;
    };

    info.update = function (e) {
      let country = false;
      if (e) country = data.Countries.find((c) => c.Country === e.name);
      const stats = country ? country.TotalConfirmed : 'no information'
      this.div.innerHTML = `<h4>Covid statistics</h4>${e
        ? `<b>${e.name}</b><br/>${stats}`
        : 'Hover over a country'}`;
    };

    info.addTo(map);

    let geoJson;
    console.log(data);
    function getColor(name) {
      const country = data.Countries.find((c) => c.Country === name);
      if (!country) { return ''; }
      const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
        '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0'];
      const k = country.TotalConfirmed;// * 100000 / country.Premium.CountryStats.Population;
      const a = (Math.floor(k / 30000) > 7) ? 7 : Math.floor(k / 30000);
      return colors[7 - a];
    }
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
    function highlightFeature(e) {
      const layer = e.target;
      layer.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.5,
      });
      layer.bringToFront();
      info.update(layer.feature.properties);
    }
    function resetHighlight(e) {
      geoJson.resetStyle(e.target);
      info.update();
    }
    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        // click: zoomToFeature,
      });
    }
    geoJson = L.geoJson(collection, {
      style,
      onEachFeature,
    }).addTo(map);
    console.log(collection);

    /* const collection = JSON.parse(request.responseText);
    const geojson = L.geoJson(collection, {
      onEachFeature: onEachFeature,
    }).addTo(map); */
    //

    /* const geoInfo = {
      array: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        };
      }),
    };
    console.log(geoInfo);

    geoInfo.array.forEach((country) => {
      const icon = L.icon({
        iconUrl: 'https://infoznaki.ru/wa-data/public/shop/products/09/56/5609/images/11729/11729.970.png',
        iconSize: [10, 10], // size of the icon
        // shadowSize:   [50, 64], // size of the shadow
        // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62],  // the same for the shadow
        // popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      });
      const marker = L.marker([country.geometry.coordinates[1], country.geometry.coordinates[0]], { icon }).addTo(map);
    }); */
  };

  request.send();
});
