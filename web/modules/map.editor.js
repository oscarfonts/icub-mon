define(["messagebus", "leaflet", "map", "draw", "L.Control.DrawSingle" /*, "data.feature"*/], function(bus, L, map) {
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
    
    bus.subscribe("data.feature.none", function(event) {
        drawItems.clearLayers();
        activeGeom = {};
        drawControl.hide();
    }, this);
           
    bus.subscribe("data.feature.read", function(event, data) {
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
     }, this);
   
    bus.subscribe("data.feature.notFound", function(event, data) {
        drawItems.clearLayers();
        activeGeom = data;
        drawControl.show();
    }, this);
    
    map.on('draw:created', function (e) {
        var feature = e.layer.toGeoJSON();
        feature.id = activeGeom.id;
        bus.publish("map.editor.featureCreated", {type: activeGeom.type, id: activeGeom.id, feature: feature});
    });
    
    map.on('draw:edited', function (e) {
        var feature = e.layers.getLayers()[0].toGeoJSON();
        feature.id = activeGeom.id;
        bus.publish("map.editor.featureEdited", {type: activeGeom.type, id: activeGeom.id, feature: feature});
    });
    
    map.on('draw:deleted', function (e) {
        bus.publish("map.editor.featureDeleted", {type: activeGeom.type, id: activeGeom.id});
    });    
});
