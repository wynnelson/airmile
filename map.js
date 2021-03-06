// initialize Leaflet
var map = L.map('map').setView({lon: -95, lat: 40}, 4);

var truck = L.icon({
  iconUrl: 'truck.svg',

  iconSize: [30,30],
  iconAnchor: [15,15],
  popupAnchor: [0, -15]
});

var reportingLocation = L.icon({
  iconUrl: 'reportingLocation.svg',

  iconSize: [46,46],
  iconAnchor: [23,23],
  popupAnchor: [0, -15]
});

// add the OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 12,
  attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);


// show the scale bar on the lower left corner
L.control.scale({imperial: true, metric: true}).addTo(map);

map.locate({setView: true, maxZoom: 6});

// currently using as global vars to manage clearing from map
var userMark;
var cMark;
var circle150;

function onLocationFound(e) {
  cMark = new L.marker(e.latlng, {icon: truck});
  cMark.addTo(map)
  cMark.bindPopup('Field Location');
}
map.on('locationfound', onLocationFound);

function onLocationError(e) {
  alert(e.message);
}
map.on('locationerror', onLocationError);


function getDistance(from, to) {
  var container = document.getElementById('distance');
  container.innerHTML = ((from.distanceTo(to)/1852).toFixed(2)) + ' Air Miles';
}


document.getElementById('calc')
  .addEventListener('click', function() {
    calculateDistance(map);
});

function calculateDistance() {
  fetch('https://nominatim.openstreetmap.org/search?format=json&q=' +
    document.getElementById('loc2').value)
    .then(response => response.json())
    .then(data => processFirstResponse(data));
  /*
  navigator.geolocation.getCurrentPosition(
    calcDistanceWithCurrentLocation,
    calcDistanceBetweenTwoInputs);
    */
}

function processFirstResponse(data) {
  if (data) {
    clearRLMarks();
    let lon = data[0].lon;
    let lat = data[0].lat;
    userMark = new L.marker({lon: lon, lat: lat}, {icon: reportingLocation});
    userMark.bindPopup('Work-Reporting Location');
    map.addLayer(userMark);
    if (isCircleWanted()) {
      addRLCircles(lon, lat);
    }
    if (!map.getBounds().contains(userMark.getLatLng())) {
      resizeMap();
    }
    getDistance(userMark.getLatLng(), cMark.getLatLng());
  }
}

function isCircleWanted() {
  return document.getElementById('includeCircle').checked;
}

function resizeMap() {
  let group = new L.featureGroup([userMark, cMark]);
  map.fitBounds(group.getBounds());
}

function clearRLMarks() {
  if (circle150) {
    map.removeLayer(circle150);
  }
  if (userMark) {
    map.removeLayer(userMark);
  }
}

function addRLCircles(lon, lat) {
  circle150 = L.circle({lon: lon, lat: lat}, {
    color: 'black',
    fillColor: '#444',
    fillOpacity: 0.4,
    radius: 277800 //in meters
  })
  map.addLayer(circle150);
}

/*
function addNewMarker(map) {
  if (userMark) {
    map.removeLayer(userMark);
  }
  let lon = document.getElementById('lon').value;
  let lat = document.getElementById('lat').value;
  userMark = new L.marker({lon: lon, lat: lat});
  userMark.bindPopup('newly added mark');
  map.addLayer(userMark);

  let from = userMark.getLatLng();
  //let from = newMark.getLatLng();
  //newMark.bindPopup('newly added mark').addTo(map);
  getDistance(from, L.marker({lon: -78.63861, lat: 35.7721}).getLatLng());
  //L.marker({lon: lon, lat: lat}).bindPopup('newly added mark').addTo(map);
  console.log(navigator.geolocation.getCurrentPosition(printGeo));
}
*/
/*
function addCurrentLocation(cPos) {
  let cLon = cPos.coords.longitude;
  let cLat = cPos.coords.latitude;
  cMark = new L.marker({lon: cLon, lat: cLat});
  cMark.bindPopup('Field Location');
  map.addLayer(cMark);
}
*/

//navigator.geolocation.getCurrentPosition(addCurrentLocation);


/*
function calcDistanceWithCurrentLocation(cPos) {
  let cLon = cPos.coords.longitude;
  let cLat = cPos.coords.latitude;
  userMark = new L.marker({lon: cLon, lat: cLat});
  userMark.bindPopup('newly added mark');
  map.addLayer(userMark);

  fetch('https://nominatim.openstreetmap.org/search?format=json&q=' +
    document.getElementById('loc2').value)
    .then(response => response.json())
    .then(data => processFirstResponse(data));
}

function calcDistanceBetweenTwoInputs() {
  console.log('gps not allowed');

}
*/
