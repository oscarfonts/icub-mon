define(["eventbus", "leaflet", "map", "data.feature", "markercluster"], function(events, L, map, features) {
   
   features.list("peca");
   
   events.listen("data.feature.listed", function(event, data) {
        var clustered = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 80,
            spiderfyDistanceMultiplier: 2,
            iconCreateFunction: function (cluster) {
                /*
                var num = Math.min(cluster.getChildCount(), 32);
                var size = 21 + num;
                var hue = 120 - (3.75 * num);
                return L.divIcon({
                    className: 'qwer',
                    iconSize: [size, size],
                    html: "<div class='mcm-marker-cluster' style='width:"+size+"px;height:"+size+"px;color:hsl("+hue+", 100%, 40%);background-color:hsl("+hue+", 50%, 80%)'>"+cluster.getChildCount()+"</div>"                    
                });
                */
               return L.divIcon({
                    className: 'mcm-marker-cluster',
                    iconSize: [23, 23],
                    html: cluster.getChildCount()
                });
            },
        });
        
        L.geoJson(data.features, {
            onEachFeature: function(feature, layer) {
                if(layer instanceof L.Marker) {
                    layer.setIcon(L.icon({
                        iconUrl: 'static/img/peces/'+feature.id+'.JPG',
                        //shadowUrl: 'leaf-shadow.png',
                        className: "mcm-marker-icon",
                        iconSize:     [64, 64]//, // size of the icon
                        //shadowSize:   [50, 64], // size of the shadow
                        //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
                        //shadowAnchor: [4, 62],  // the same for the shadow
                        //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
                    }));
                }
                clustered.addLayer(layer);
            }
        });
        
        map.addLayer(clustered);
        map.fitBounds(clustered.getBounds());
   });
});
