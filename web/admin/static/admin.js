var mapData = null;

var mapStatus = null;

var DATA_TYPES = {
    CONTINENTS: {
        name: 'Continents',
        url: '../static/data/continents.geojson'
    },
    CULTURES: {
        name: 'Cultures',
        url: '../api/cultura_feature?q={"filters":[{"name":"continent","op":"==","val":%ID%}]}'
    },
    ITEMS: {
        name: 'Peces',
        url: '../api/peca_feature?q={"filters":[{"name":"cultura","op":"==","val":%ID%}]}'
    },
    DETAIL: {
        name: 'Peça',
        url: '../api/peca_feature/%ID%'
    }
};

var GEOMETRY_TYPES = {
    // TODO
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

function loadData(type, id) {
    var url = DATA_TYPES[type].url;
    if (url) {
        $.ajax({
            url: id ? url.replace(/%ID%/, id) : url,
            dataType: "json"
        }).done(function(response) {
            updateTOC(type, id, response.features);
            if (type != "DETAIL") {
                newData = L.geoJson(response, {
                    style: styles.normal,
                    onEachFeature: bindFeatureEvents
                });
               
                if (newData.getLayers().length) {
                    if (mapData) map.removeLayer(mapData);
                    mapData = newData;
                    newData.addTo(map);
                    if (type == "CONTINENTS")
                        map.setView([40, 0], 2);
                    else
                        map.fitBounds(newData.getBounds());
                    mapStatus = {};
                    mapStatus[type] = id | true;
                } else {
                    // TODO
                    /*
                    var hash = location.hash.substr(1).split("/");
                    hash.pop();
                    location.hash = hash.join("/");
                    alert ("No s'hi han trobat " + DATA_TYPES[type].name);
                    */
                }
            }
        });
    }
}

$(window).bind('hashchange', function(e) {
    readStatusFromHash();
});

function updateTOC(type, id, features) {
    var el, stuff ="";
    if (type == "CONTINENTS") {
        el = $(".contents");
        for (i in features) {
            feature = features[i];
            nom = feature.properties.nom;
            fid = feature.id || feature.properties.id;
            stuff += '<li><a href="#'+fid+'">'+nom+'</a></li>';
        }
        el.html(stuff);
    }
    if (type == "CULTURES") {
        stuff = "<ul class='nav'>";
        el = $(".contents a[href='#"+id+"']");
        hash = el.attr("href");
        for (i in features) {
            feature = features[i];
            nom = feature.properties.nom + "(" + feature.id + ")";
            fid = feature.id | feature.properties.id;
            stuff += '<li><a href="'+hash+"/"+fid+'">'+nom+'</a></li>';
        }
        stuff += "</ul>";
        el.parent().children("ul").remove();
        el.parent().append(stuff);
        $(".active").removeClass('active');
        el.parents("li").addClass('active');
    }
    if (type == "ITEMS") {
        stuff = "<ul class='nav'>";
        el = $(".contents a[href$='/"+id+"']");
        hash = el.attr("href");
        for (i in features) {
            feature = features[i];
            nom = feature.properties.num_registre;
            fid = feature.id | feature.properties.id;
            stuff += '<li><a href="'+hash+"/"+fid+'">'+nom+'</a></li>';
        }
        stuff += "</ul>";
        el.parent().children("ul").remove();
        el.parent().append(stuff);
        $(".active").removeClass('active');
        el.parents('li').addClass('active');        
    }
    if (type == "DETAIL") {
        el = $(".contents a[href$='/"+id+"']");
        $(".active").removeClass('active');
        el.parents("li").addClass('active');
    }
}

function readStatusFromHash() {
    var elems = location.hash.substr(1).split("/");
    var n = (elems && elems.length) || 0;
    var id = elems[n-1];
    if (!id || n==0) {
        loadData("CONTINENTS");
    } else if (n==1) {
        loadData("CULTURES", id);
    } else if (n==2) {
        loadData("ITEMS", id);
    } else if (n==3) {
        loadData("DETAIL", id);
    }
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
    layer.setStyle(styles.hover);
    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    mapData.resetStyle(e.target);
}

function selectFeature(e) {
    var feature = e.target.feature;
    var id = feature.id | feature.properties.id;
    var name = feature.properties.nom;
    if (mapStatus.CONTINENTS) {
        location.hash = id;        
    } else if (mapStatus.CULTURES) {
        location.hash += "/" + id;
    } else if (mapStatus.ITEMS) {
        location.hash += "/" + id;
    }
}

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

L.control.layers({
    "Ride": ride,
    "Minimal": minimal,
    "Midnight": midnight,
    "Pale": pale,
    "Fresh": fresh
},{},{collapsed: false}).addTo(map);

readStatusFromHash();
