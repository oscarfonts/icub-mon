define(["eventbus", "leaflet", "map", "feature", "draw", "L.Control.DrawSingle"], function(events, L, map) {

    var activeGeom = {};

    var drawItems = L.featureGroup().addTo(map);

    var drawControl = new L.Control.DrawSingle({
        edit: {
            featureGroup: drawItems
        },
        draw: {
            polyline: false,
            rectangle: false,
            circle: false
        }
    }).addTo(map);
    
    events.listen("feature.clear", function(event) {
        drawItems.clearLayers();
        activeGeom = {};
        drawControl.hide();
    });
           
    events.listen("feature.load", function(event, data) {
        //alert("Feature loaded: " + JSON.stringify(data));
        drawItems.clearLayers();
        activeGeom = data;
        var feature = L.geoJson(data.feature, {
            onEachFeature: function (feature, layer) {
                drawItems.addLayer(layer);
            }
        });
        map.fitBounds(feature.getBounds());
     });
   
    events.listen("feature.new", function(event, data) {
        //alert("Feature not found: " + JSON.stringify(data));
        drawItems.clearLayers();
        activeGeom = data;
        drawControl.show();
    });
    
    map.on('draw:created', function (e) {
        var feature = e.layer.toGeoJSON();
        feature.id = activeGeom.id;
        events.send("editor.created", {type: activeGeom.type, id: activeGeom.id, feature: feature});
    });
    
    map.on('draw:edited', function (e) {
        var feature = e.layers.getLayers()[0].toGeoJSON();
        feature.id = activeGeom.id;
        events.send("editor.edited", {type: activeGeom.type, id: activeGeom.id, feature: feature});
    });
    
    map.on('draw:deleted', function (e) {
        events.send("editor.deleted", {type: activeGeom.type, id: activeGeom.id});
    });
    
});
