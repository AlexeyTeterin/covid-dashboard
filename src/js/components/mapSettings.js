const mapbox = {
  mapURL: 'https://api.mapbox.com/styles/v1/alexeyteterin/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  token: 'pk.eyJ1IjoiYWxleGV5dGV0ZXJpbiIsImEiOiJja2ppaHYyeDMxOXE2MnhvN3J5eXoxeXJ0In0.jr2Ql5GDOrgMXi1mWaUJBQ',
  lightMapID: 'ckm4i40vq20tz17lhsfmmwsi6',
  darkMapID: 'ckjiols004v5219tednapnr06',
};

export const { mapURL } = mapbox;

const mapParams = {
  attribution: '',
  maxZoom: 6,
  minZoom: 1,
  tileSize: 512,
  zoomOffset: -1,
  accessToken: mapbox.token,
};

export const darkMapParams = { id: mapbox.darkMapID, ...mapParams };

export const lightMapParams = { ...mapParams, id: mapbox.lightMapID };

export const mapSettings = {
  fillOpacity: 0.8,
  hoverBorderColor: '#e7e7e7',
  borderWeight: 1.5,
  colors: [
    '#990000',
    '#cc0000',
    '#ff1a1a',
    '#ff3333',
    '#ff6666',
    '#ff8080',
    '#ff9999',
    '#ffb3b3',
  ],
};

export const countrySelectStyle = {
  weight: mapSettings.borderWeight,
  color: mapSettings.hoverBorderColor,
  dashArray: '',
  fillOpacity: mapSettings.fillOpacity,
};

export const countryDefaultStyle = {
  color: '',
  opacity: mapSettings.fillOpacity,
  fillOpacity: mapSettings.fillOpacity * 0.75,
};
