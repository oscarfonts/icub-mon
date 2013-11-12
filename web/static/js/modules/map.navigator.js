define(["eventbus", "map", "map.styler-kit", "nav-state", "markercluster", "details"], function(events, map, stylerkit, state) {
    
    var data = null;
    
    var clustered = null;
    
    events.listen("data.feature.listed", function(event, d) {
        data = d;
        draw();
    }, this);
    
    events.listen("iconstyle.changed", function(event) {
        draw();
    }, this);
    
    function draw() {
        var firstDraw = true;
        if (clustered) {
            clustered.clearLayers();
            map.removeLayer(clustered);
            clustered = null;
            firstDraw = false;
        }
        clustered = L.markerClusterGroup(stylerkit.getStyler().clusterOptions());
        
        L.geoJson(data.features, {
            onEachFeature: function(feature, layer) {
                if (layer instanceof L.Marker) {
                    layer.setIcon(
                        L.divIcon({
                            className: 'mcm-hide-marker',
                            html: stylerkit.getStyler().contents(feature)
                        })
                    );
                    layer.on('click', function(e) {
                        stylerkit.getStyler().select(layer.feature.id);
                                               
                        if (layer instanceof L.Marker) {
                            var minZoomForMarkers = 6;
                            if (map.getZoom() < minZoomForMarkers) {
                                map.setView(layer.getLatLng(), minZoomForMarkers, {animate: true});
                            } else {
                                map.panTo(layer.getLatLng(), {animate: true});
                            }
                        } else {
                            map.fitBounds(layer.getBounds(), {animate: true});
                        }
                        
                        events.send("map.navigator.markerSelected", feature);
                    });
                }
                clustered.addLayer(layer);
            }
        });
        
        map.addLayer(clustered);
       
        events.send("map.navigator.loaded");

        if (firstDraw) {
            map.fitBounds(clustered.getBounds());
            firstDraw = false;
        }

    };
});
