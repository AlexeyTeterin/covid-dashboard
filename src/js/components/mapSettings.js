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

export const mapParams2 = {
  attribution: '',
  maxZoom: 6,
  minZoom: 1,
  id: 'ckm4lcssq1m9g17nw6o9jxlpb',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiYWxleGV5dGV0ZXJpbiIsImEiOiJja2ppaHYyeDMxOXE2MnhvN3J5eXoxeXJ0In0.jr2Ql5GDOrgMXi1mWaUJBQ',
};

export const mapSettings = {
  fillOpacity: 0.8,
  hoverBorderColor: '#e7e7e7',
  borderWeight: 1.5,
  colors: [
    '#660000',
    '#990000',
    '#cc0000',
    '#ff0000',
    '#ff3333',
    '#ff6666',
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
