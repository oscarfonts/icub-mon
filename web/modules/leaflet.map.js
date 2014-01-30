/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet", "leaflet.layers"], function(L, layers) {

    function create(id) {
        var div = id ? id : 'map';
        
        var map = L.map(div, {
            center: [32, 0],
            zoom: 2,
            minZoom: 1,
            scrollWheelZoom: false
        });
        
        layers.create({
            "Pale":   { type: "cloudmade", id: 998 },
            "MapBox": { type: "mapbox",    id: "oscarfonts.map-1mujgtmu" },
            "Aerial": { type: "bing",      id: "AerialWithLabels" },
            "Roads":  { type: "bing",      id: "Road" }
        }).addTo(map);
       
        return map;
    }
    
    return {
        create: create
    };

});