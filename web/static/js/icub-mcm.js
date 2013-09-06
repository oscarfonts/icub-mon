var map = L.map('map').setView([40, 0], 2);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var style = {
    color: '#0000FF',
    weight: 1,
    opacity: 1,
    fillColor: '#0000FF',
    fillOpacity: 0.6
};

var hoverStyle = {
  weight: 3,
  color: '#FF0000',
  fillColor: '#FF0000'
}

var selectedStyle = {
  weight: 3,
  color: '#00FF00',
  fillColor: '#00FF00'
}

var geojson;

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle(hoverStyle);

  if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
  }

  info.update(layer.feature.properties);
}

function resetHighlight(e) {
  geojson.resetStyle(e.target);
  info.update();
}

function selectFeature(e) {
  var layer = e.target;
  map.fitBounds(layer.getBounds());
  map.removeLayer(geojson);
  loadCultures(layer.feature.properties.id);
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: selectFeature
  });
}

$.ajax({
  url: "static/data/continents.geojson",
  dataType: "json"
}).done(function(data) {
  geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);
});

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = props ?
      '<h4>Continent</h4><b>'+props.nom+'</b>' :
      '<h4>Continents</h4>';
};

info.addTo(map);

function loadCultures(continent) {
  $.ajax({
    url: "static/data/africa.geojson",
    dataType: "json"
  }).done(function(data) {
    geojson = L.geoJson(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  });
}
