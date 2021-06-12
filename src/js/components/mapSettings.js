export const mapURL = 'https://api.mapbox.com/styles/v1/alexeyteterin/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';

export const mapParams = {
  attribution: '',
  maxZoom: 6,
  minZoom: 1,
  id: 'ckjiols004v5219tednapnr06',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiYWxleGV5dGV0ZXJpbiIsImEiOiJja2ppaHYyeDMxOXE2MnhvN3J5eXoxeXJ0In0.jr2Ql5GDOrgMXi1mWaUJBQ',
};

export const mapSettings = {
  fillOpacity: 0.6,
  hoverBorderColor: '#e7e7e7',
  borderWeight: 1.5,
  colors: [
    '#800026',
    '#BD0026',
    '#E31A1C',
    '#FC4E2A',
    '#FD8D3C',
    '#FEB24C',
    '#FED976',
    '#FFEDA0',
  ],
};

export const countrySelectStyle = {
  weight: mapSettings.borderWeight,
  color: mapSettings.hoverBorderColor,
  dashArray: '',
  fillOpacity: mapSettings.fillOpacity,
};
