var mapData = null;

var WORLD     = 0,
    CONTINENT = 1,
    CULTURE   = 2,
    ITEM      = 3;

var FEATURE_API = [
    'static/data/continents.geojson',
    'api/cultura_feature?q={"filters":[{"name":"continent","op":"==","val":%ID%}]}',
    'api/peca_feature?q={"filters":[{"name":"cultura","op":"==","val":%ID%}]}',
    'api/peca_feature/%ID%'
];

var LABEL_API = [
    '',                                               // "world"
    'http://127.0.0.1:5000/api/continent/%ID%',       // nom
    'http://127.0.0.1:5000/api/cultura_feature/%ID%', // properties.nom
    'http://127.0.0.1:5000/api/peca_feature/%ID%'     // properties.titol
];

var labels = [];

var status = new function () {
    // TODO labels still not working **AT ALL**
    this.labels = ["Món"];
    this.get = function() {
        return location.hash.match(/(\d+)/g) || [];
    };
    this.level = function() {
        return this.get().length;
    };
    this.push = function(id, label) {
        this.labels.push(label);
        if (this.get().length == 0) {
            location.hash = id;
        } else if (this.get().length < 3) {
            location.hash += "/" + id;
        }
    };
    this.pop = function() {
        labels = this.labels;
        labels.pop();
        this.labels = labels;
        ids = this.get();
        ids.pop();
        location.hash = ids.join("/");
    };
    this.label = function(level) {
        return this.labels[level];
    };
};

var styles = {
    normal: {
        color: '#0000FF',
        weight: 1,
        opacity: 1,
        fillColor: '#0000FF',
        fillOpacity: 0.6
    },    
    hover: {
        weight: 3,
        color: '#FF0000',
        fillColor: '#FF0000'
    }
};

function loadData(level, id) {
    var url = FEATURE_API[level];
    if (url) {
        $.ajax({
            url: id ? url.replace(/%ID%/, id) : url,
            dataType: "json"
        }).done(function(response) {
            newData = L.geoJson(response, {
                style: styles.normal,
                onEachFeature: bindFeatureEvents
            });
            if (newData.getLayers().length) {
                if (mapData) map.removeLayer(mapData);
                mapData = newData;
                newData.addTo(map);
                if (level == WORLD)
                    map.setView([40, 0], 2);
                else
                    map.fitBounds(newData.getBounds());
            } else {
                status.pop();
                alert ("No s'hi han trobat elements");
            }
            info.update();
        });
    }
}

function buildBreadcrumb() {
    // <li class="head"><a href="#">Món</a></li>
    // <li><a href="#1">Àfrica</a></li>
    // <li><a href="#1/42228">cultura Edo, regne de Benín</a></li>
    // <li class="active">Placa decorativa</li>
    // <li class="next">Next...</li>
    ids = status.get();
    level = status.level();
    if (level > WORLD) {
        html = '<li class="active">'+status.labels[level]+'</li>';
        while (ids.length > 1) {
            id = ids.pop();
            html = '<li><a href="#'+ids.join("/")+'">'+status.labels[ids.length]+'</a></li>' + html;
        }
        html = '<li class="head"><a href="#">'+status.labels[WORLD]+'</a></li>' + html;
    } else {
        html = '<li class="head">'+status.labels[WORLD]+'</li>';
    }
    $("#breadcrumb").html(html);
}

$(window).bind('hashchange', function(e) {
    load();
});

function load() {
    loadData(status.level(), status.get().pop());
    buildBreadcrumb();
};

function bindFeatureEvents(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: selectFeature
    });
}

function highlightFeature(e) {
    var layer = e.target;
    if (layer.setStyle) {
        layer.setStyle(styles.hover);
        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    mapData.resetStyle(e.target);
    info.update();
}

function selectFeature(e) {
    var feature = e.target.feature;
    var id = feature.id || feature.properties.id;
    var name = feature.properties.nom || feature.properties.titol;
    status.push(id, name);
}

/* Info Control */
L.Control.Info = L.Control.extend({
    onAdd: function (map) {
        this._div = L.DomUtil.create('div', 'info');
        //this.update();
        return this._div;
    },
    update: function (properties) {
        // TODO destroy this or do something useful
    }
});

L.control.info = function (options) {
    return new L.Control.Info(options);
};

/* Instantiate map */
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/f9b48b21a87048bfb118148491d22ec5/{styleId}/256/{z}/{x}/{y}.png',
cloudmadeAttribution = 'Map data &copy; OpenStreetMap contributors, imagery &copy; CloudMade';
var ride = L.tileLayer(cloudmadeUrl, {styleId: 1714, attribution: cloudmadeAttribution});
    minimal = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),
    midnight = L.tileLayer(cloudmadeUrl, {styleId: 999, attribution: cloudmadeAttribution}),
    pale = L.tileLayer(cloudmadeUrl, {styleId: 998, attribution: cloudmadeAttribution}),
    fresh = L.tileLayer(cloudmadeUrl, {styleId: 997, attribution: cloudmadeAttribution}); 

var map = L.map('map', {
    center: [0, 0],
    zoom: 0,
    //maxBounds: [[-90, -180], [90, 180]],
    layers: [ride]
    });

var info = L.control.info().addTo(map);

L.control.layers({
    "Ride": ride,
    "Minimal": minimal,
    "Midnight": midnight,
    "Pale": pale,
    "Fresh": fresh
},{},{position: 'topleft'}).addTo(map);

load();
