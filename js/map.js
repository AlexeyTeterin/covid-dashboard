export default function setMap(res) {
  const request = new XMLHttpRequest();
  request.open('GET', './assets/json/countries.json');
  request.onload = () => {
    const collection = JSON.parse(request.responseText);

    const map = L.map('mapid').setView([40, 20], 2);
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
    const northEast = L.latLng(85, 180);
    const bounds = L.latLngBounds(southWest, northEast);

    map.setMaxBounds(bounds);
    /// events and countries layout

    const info = L.control();
    const clickedCountry = { target: null, name: '' };

    info.onAdd = function () {
      this.div = L.DomUtil.create('div', 'info');
      this.update();
      return this.div;
    };

    info.update = function (e) {
      let country = false;
      if (e) country = res.Countries.find((c) => c.Country === e.name);
      const stats = country ? country.TotalConfirmed : 'no information';
      this.div.innerHTML = `<h4>Covid statistics</h4>${e
        ? `<b>${e.name}</b><br/>${stats}`
        : 'Hover over a country'}`;
    };

    info.addTo(map);

    let geoJson;
    document.querySelector('.list').addEventListener('click', (e) => {
      const clickedListName = res.Countries
        .find((a) => a.Country === e.path[1].dataset.Country).Country;
      if (clickedCountry.target) geoJson.resetStyle(clickedCountry.target);
      if (clickedListName === clickedCountry.name) {
        clickedCountry.name = '';
        clickedCountry.target = null;
        return;
      }
      let target;
      for (const key in geoJson._layers) {
        if (geoJson._layers[key].feature.properties.name === clickedListName) {
          target = geoJson._layers[key];
          break;
        }
      }
      if (!target) return;
      clickedCountry.name = clickedListName;
      clickedCountry.target = target;
      target.setStyle({
        weight: 1,
        color: '#e7e7e7',
        dashArray: '',
        fillOpacity: 0.5,
      });
    });

    function handleClick(e) {
      const { name } = e.target.feature.properties;
      if (res.Countries.find((a) => a.Country === name)) {
        const clickEvent = new Event('click', { bubbles: true });
        const targetRow = Array.from(document.querySelectorAll('.list__row'))
          .filter((row) => row.firstChild.textContent === name)[0];
        if (targetRow) {
          // if (targetRow.classList.contains('list__row_active')) return;
          targetRow.firstChild.dispatchEvent(clickEvent);
        }
      }
    }

    function getColor(name) {
      const country = res.Countries.find((c) => c.Country === name);
      if (!country) { return ''; }
      const colors = ['#800026', '#BD0026', '#E31A1C', '#FC4E2A',
        '#FD8D3C', '#FEB24C', '#FED976', '#FFEDA0',
      ];
      const k = country.TotalConfirmed; // * 100000 / country.Premium.CountryStats.Population;
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
      if (clickedCountry.target !== e.target) {
        geoJson.resetStyle(e.target);
      }
      info.update();
    }

    function onEachFeature(feature, layer) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: handleClick,
      });
    }
    geoJson = L.geoJson(collection, {
      style,
      onEachFeature,
    }).addTo(map);
  };

  request.send();
}
