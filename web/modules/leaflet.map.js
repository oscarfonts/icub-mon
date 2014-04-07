/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet", "leaflet.layers"], function(L, layers) {

    function create(id) {
        var div = id ? id : 'map';

        var map = L.map(div, {
            center: [32, 0],
            maxBounds: [[-85, -500], [85, 500]],
            zoom: 2,
            minZoom: 1,
            scrollWheelZoom: false
        });
        
        layers.create({
            "Pale":   { type: "cloudmade", id: 998 },
            "Aerial": { type: "bing",      id: "AerialWithLabels" },
            "Roads":  { type: "bing",      id: "Road" },
            "MapBox": { type: "mapbox",    id: "oscarfonts.map-1mujgtmu" }
        }).addTo(map);
       
        return map;
    }
    
    return {
        create: create
    };

});