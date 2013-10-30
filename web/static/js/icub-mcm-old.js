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

var mapData = null;

var styles = {
    normal: {
        color: '#AA8800',
        weight: 2,
        opacity: 1,
        fillColor: '#AA8800',
        fillOpacity: 0.6
    },    
    hover: {
        weight: 2,
        color: '#CCFF00',
        fillColor: '#CCFF00'
    }
};

var viewStatus = new function() {
    this.kk = "";
    this.get = function() {
        return location.hash.match(/(\d+)/g) || [];
    };
    this.level = function() {
        return this.get().length;
    };
    this.push = function(id) {
        if (this.get().length == 0) {
            location.hash = id;
        } else if (this.get().length < 3) {
            location.hash += "/" + id;
        }
    };
    this.pop = function() {
        ids = this.get();
        ids.pop();
        location.hash = ids.join("/");
    };
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
                viewStatus.pop();
                alert ("No s'hi han trobat elements");
            }
            info.update();
        });
    }
}

function buildBreadcrumb() {
    ids = viewStatus.get();
    level = viewStatus.level();
    if (level > WORLD) {
        id = ids.pop();
        html = '<li class="active">'+labels.data[level][id]+'</li>';
        while (ids.length > 0) {
            hash = ids.join("/");
            level = ids.length;
            id = ids.pop();
            html = '<li><a href="#'+hash+'">'+labels.data[level][id]+'</a></li>' + html;
        }
        html = '<li class="head"><a href="#">'+labels.data[WORLD]+'</a></li>' + html;
    } else {
        html = '<li class="head">'+labels.data[WORLD]+'</li>';
    }
    $("#breadcrumb").html(html);
    info.update();
}

$(window).bind('hashchange', function(e) {
    load();
});

function load() {
    loadData(viewStatus.level(), viewStatus.get().pop());
    if (!labels.ready()) {
        labels.load(buildBreadcrumb);
    } else {
        buildBreadcrumb();
    }
};

var labels = new function() {
    this.API = [
        '',              // "world"
        'api/continent', // nom
        'api/cultura',   // properties.nom
        'api/peca'       // properties.titol
    ];
    this.data = [];
    this.loaded = 0;
    this.ready = function() {
        return this.loaded == 3;
    };
    this.load = function(callback) {
        this.data[WORLD] = "Món";
        $.ajax({
            url: this.API[CONTINENT],
            dataType: "json"
        }).done(function(response) {
            labels.data[CONTINENT] = [];
            for (i in response.objects) {
                labels.data[CONTINENT][response.objects[i].id] = response.objects[i].nom;
            }
            labels.loaded++;
            if(labels.ready()) {callback();};
        });
        $.ajax({
            url: this.API[CULTURE],
            dataType: "json"
        }).done(function(response) {
            labels.data[CULTURE] = [];
            for (i in response.objects) {
                labels.data[CULTURE][response.objects[i].id] = response.objects[i].nom;
            }
            labels.loaded++;
            if(labels.ready()) {callback();};
        });
        $.ajax({
            url: this.API[ITEM],
            dataType: "json"
        }).done(function(response) {
            labels.data[ITEM] = [];
            for (i in response.objects) {
                labels.data[ITEM][response.objects[i].id] = response.objects[i].titol;
            }
            labels.loaded++;
            if(labels.ready()) {callback();};
        });
    };
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
    viewStatus.push(id);
}

/* Info Control */
L.Control.Info = L.Control.extend({
    onAdd: function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    },
    update: function (properties) {
        var heading = "",
            content = "";
        switch(viewStatus.level()) {
            case WORLD:
                heading = "Continents del Món";
                content = properties ? properties.nom : "";
                break;
            case CONTINENT:
                if (labels.ready())
                    heading = "Cultures d'" + labels.data[CONTINENT][viewStatus.get()[0]];
                else
                    heading = "Cultura";
                content = properties ? properties.nom : "";
                break;
            case CULTURE:
                if (labels.ready())
                    heading = "Peces de la " + labels.data[CULTURE][viewStatus.get()[1]];
                else
                    heading = "Peça";
                content = properties ? properties.titol : "";
                break;
            case ITEM:
                heading = "Detalls de la peça";
                if (mapData) {
                    ids = viewStatus.get();
                    heading = labels.data[ITEM][ids[2]];
                    properties = mapData.getLayers()[0].feature.properties;
                    content = "";
                    if (properties) {
                        if (labels.ready()) {
                            content += "<b>" + labels.data[CULTURE][ids[1]] + "</b> (" + labels.data[CONTINENT][ids[0]] + ")<br/><br/>";
                        }
                        content += '<img class="thumbnail center" src="static/img/foto.png" alt="fotografia de la peça"/><br/>';
                        content += "Data: " + properties.data_descr + "<br/>";
                        content += properties.material + "<br/>";
                        content += "Mides: " + properties.mida_descr + "<br/><br/>";
                    }
                }
                break;
        };
        this._div.innerHTML = "<h4>" + heading + "</h4>" + content;
    }
});

L.control.info = function (options) {
    return new L.Control.Info(options);
};

/* Instantiate map */
var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/f9b48b21a87048bfb118148491d22ec5/{styleId}/256/{z}/{x}/{y}.png',
cloudmadeAttribution = 'OpenStreetMap | CloudMade';
mapboxAttribution = 'OpenStreetMap | MapBox';
var mapbox = L.tileLayer('http://a.tiles.mapbox.com/v3/oscarfonts.map-1mujgtmu/{z}/{x}/{y}.png', {attribution: mapboxAttribution}),
    //Aerial, AerialWithLabels, Birdseye, BirdseyeWithLabels, Road
    bing_aerial = new L.BingLayer("Au0fzRXOjOMS6KE0Z5ZOLjVIt57V1OvnUamDKKs6CaC1-Cx-0_oSFl3J9aIwUgSM", {type: 'AerialWithLabels', culture: 'es-ES'}); 
    bing_roads = new L.BingLayer("Au0fzRXOjOMS6KE0Z5ZOLjVIt57V1OvnUamDKKs6CaC1-Cx-0_oSFl3J9aIwUgSM", {type: 'Road', culture: 'es-ES'}),
    pale = L.tileLayer(cloudmadeUrl, {styleId: 998, attribution: cloudmadeAttribution});

var map = L.map('map', {
    center: [40, 0],
    zoom: 2,
    maxZoom: 13,
    //maxBounds: [[-90, -180], [90, 180]],
    layers: [mapbox]
    });

var info = L.control.info().addTo(map);

L.control.layers({
    "MapBox": mapbox,
    "Aerial": bing_aerial,
    "Roads": bing_roads,
    "Pale": pale
},{},{position: 'bottomright'}).addTo(map);

load();
