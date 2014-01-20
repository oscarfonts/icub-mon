define(["messagebus", "leaflet", "map", "draw", "L.Control.DrawSingle"], function(bus, L, map) {
    
    // Initialize editor
    var loaded = {};
    
    var leafletItems = L.featureGroup().addTo(map);
    
    var leafletDraw = new L.Control.DrawSingle({
        edit: {
            featureGroup: leafletItems
        },
        draw: {
            polyline: false,
            rectangle: false,
            circle: false
        }
    }).addTo(map);
    
    function load(type, id, feature) {
        leafletItems.clearLayers();

        loaded = {
            type: type,
            id: id,
            feature: feature
        };

        L.geoJson(feature, {
            onEachFeature: function (feature, layer) {
                leafletItems.addLayer(layer);
                if (layer instanceof L.Marker) {
                    map.setView(layer.getLatLng(), 6, {animate: true});
                } else {
                    map.fitBounds(layer.getBounds());
                }
            }
        });
        
        leafletDraw.show();
    }
    
    function hide() {
        leafletItems.clearLayers();
        loaded = {};
        leafletDraw.hide();
    }
    
    map.on('draw:created', function (e) {
        var feature = e.layer.toGeoJSON();
        feature.id = loaded.id;
        bus.publish("map.editor.featureCreated", {type: loaded.type, id: loaded.id, feature: feature});
    });
    
    map.on('draw:edited', function (e) {
        var feature = e.layers.getLayers()[0].toGeoJSON();
        feature.id = loaded.id;
        bus.publish("map.editor.featureEdited", {type: loaded.type, id: loaded.id, feature: feature});
    });
    
    map.on('draw:deleted', function (e) {
        bus.publish("map.editor.featureDeleted", {type: loaded.type, id: loaded.id});
    });
    
    return {
        load: load,
        hide: hide
    };
    
});
