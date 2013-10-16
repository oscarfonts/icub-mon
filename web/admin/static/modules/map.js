define(["eventbus", "leaflet", "baselayers"], function(events, L, baselayers) {

    // Map   
    var map = L.map('map', {
        center: [32, 0],
        zoom: 2
    });
    
    // Base Layers
    baselayers.create({
        "Pale":   { type: "cloudmade", id: 998 },
        "Aerial": { type: "bing",      id: "AerialWithLabels" },
        "Roads":  { type: "bing",      id: "Road" }
    }).addTo(map);
   
    return map;
    
});
