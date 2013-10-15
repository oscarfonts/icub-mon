define(["eventbus", "leaflet", "cloudmade"], function(events, L, cloudmade) {
   
    var map = L.map('map', {
        center: [0, 0],
        zoom: 2
    });

    cloudmade.layers({
        "Minimal": 22677,
        "Midnight":  999,
        "Pale":      998,
        "Fresh":     997,
        "Ride":     1714
    }).addTo(map);
    
    map.whenReady(function() {
        events.send("map.loaded", map);
    });
    
    return map;
    
});
