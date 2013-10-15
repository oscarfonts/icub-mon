define(["eventbus", "css-loader", "leaflet", "cloudmade", "feature", "draw"], function(events, css, L, cloudmade) {
    
    loadStyles();
   
    var map = L.map('map', {
        center: [0, 0],
        zoom: 2
    });

    cloudmade.layers({
        "Minimal": 22677,
        "Midnight":  999,
        "Pale":      998,
        "Fresh":     997,
        "Ride":     1714
    }).addTo(map);
    
    events.listen("feature.loaded", function(event, data) {
        var drawnItems = new L.FeatureGroup();
        var feature = L.geoJson(data.feature, {
            onEachFeature: function (feature, layer) {
                drawnItems.addLayer(layer);
            }
        });
        //drawnItems.addLayer(feature);
        map.addLayer(drawnItems);
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: drawnItems
            }
        });
        map.addControl(drawControl);
        
     });
   
    events.listen("feature.notfound", function(event, data) {
        // TODO: Create & edit on map
        alert("Feature not found");
    });
   
    return map;

    function loadStyles() {
        events.send("css.load", "../static/css/leaflet.css");
        events.send("css.load", "../static/css/leaflet.draw.css");
        if ($('html.lt-ie9').size()) {
            events.send("css.load", "../static/css/leaflet.ie.css");
            events.send("css.load", "../static/css/leaflet.draw.ie.css");
        }
    }
    
});
