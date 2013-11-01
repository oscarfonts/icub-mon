define(["eventbus", "map", "data.feature", "markercluster"], function(events, map, features) {
   
    features.list("cultura");
   
    events.listen("data.feature.listed", function(event, data) {
        var clustered = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 75,
            spiderfyDistanceMultiplier: 3,
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
                            html: '<div class="btn btn-xs btn-primary">'+feature.properties.nom+'</div>'
                        })
                    );
                }
                clustered.addLayer(layer);
            }
        });
        
        map.addLayer(clustered);
        map.fitBounds(clustered.getBounds());
    });
});
