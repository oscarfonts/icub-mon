define(["eventbus", "leaflet", "map", "draw", "L.Control.DrawSingle", "data.feature"], function(events, L, map) {

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
    
    events.listen("data.feature.none", function(event) {
        drawItems.clearLayers();
        activeGeom = {};
        drawControl.hide();
    });
           
    events.listen("data.feature.read", function(event, data) {
        drawItems.clearLayers();
        activeGeom = data;
        var feature = L.geoJson(data.feature, {
            onEachFeature: function (feature, layer) {
                drawItems.addLayer(layer);
                if (layer instanceof L.Marker) {
                    map.setView(layer.getLatLng(), 6, {animate: true});
                } else {
                    map.fitBounds(layer.getBounds());
                }
            }
        });
     });
   
    events.listen("data.feature.notFound", function(event, data) {
        drawItems.clearLayers();
        activeGeom = data;
        drawControl.show();
    });
    
    map.on('draw:created', function (e) {
        var feature = e.layer.toGeoJSON();
        feature.id = activeGeom.id;
        events.send("map.editor.featureCreated", {type: activeGeom.type, id: activeGeom.id, feature: feature});
    });
    
    map.on('draw:edited', function (e) {
        var feature = e.layers.getLayers()[0].toGeoJSON();
        feature.id = activeGeom.id;
        events.send("map.editor.featureEdited", {type: activeGeom.type, id: activeGeom.id, feature: feature});
    });
    
    map.on('draw:deleted', function (e) {
        events.send("map.editor.featureDeleted", {type: activeGeom.type, id: activeGeom.id});
    });
    
});
