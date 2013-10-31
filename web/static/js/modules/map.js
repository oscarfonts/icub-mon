define(["leaflet", "map.layers"], function(L, layers) {

    var map = L.map('map', {
        center: [32, 0],
        zoom: 2
    });
    
    layers.create({
        "Pale":   { type: "cloudmade", id: 998 },
        "MapBox": { type: "mapbox",    id: "oscarfonts.map-1mujgtmu" },
        "Aerial": { type: "bing",      id: "AerialWithLabels" },
        "Roads":  { type: "bing",      id: "Road" }
    }).addTo(map);
   
    return map;
    
});
