define(["eventbus", "map", "markercluster", "nav-state", "details"], function(events, map) {
    
    var active_culture = false;
    
    events.listen("data.feature.listed", function(event, data) {
        var clustered = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 75,
            spiderfyDistanceMultiplier: 3,
            removeOutsideVisibleBounds: false,
            iconCreateFunction: function (cluster) {
               return L.divIcon({
                    className: 'mcm-hide-marker',
                    html: '<div class="btn btn-xs btn-danger"><b>'+cluster.getChildCount()+'</b> cultures</div>'
                });
            },
        });
        
        L.geoJson(data.features, {
            onEachFeature: function(feature, layer) {
                if (layer instanceof L.Marker) {
                    layer.setIcon(
                        L.divIcon({
                            className: 'mcm-hide-marker',
                            html: '<div class="btn btn-xs btn-primary" id="marker-cultura-'+feature.id+'">'+feature.properties.nom+'</div>'
                        })
                    );
                    layer.on('click', function(e) {
                        if (active_culture) {
                            $("#marker-cultura-"+active_culture).removeClass("btn-success").addClass("btn-primary");
                        }
                        active_culture = layer.feature.id;
                        $("#marker-cultura-"+layer.feature.id).removeClass("btn-primary").addClass("btn-success");
                        
                        events.send("culturaSelected", feature);                        
                        
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
                    });
                }

                clustered.addLayer(layer);
            }
        });
        
        map.addLayer(clustered);
        map.fitBounds(clustered.getBounds());
    });
});
