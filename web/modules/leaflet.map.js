/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet", "leaflet.layers", "leaflet-minimap"], function(L, layers) {
    
    var mapbox_bright = "oscarfonts.map-1mujgtmu";
    var mapbox_pale = "oscarfonts.hnmjhnd6";

    function create(id, minimap) {
        var div = id ? id : 'map';

        var map = L.map(div, {
            center: [32, 0],
            maxBounds: [[-85, -500], [85, 500]],
            zoom: 2,
            minZoom: 1,
            scrollWheelZoom: false
        });
        
        layers.create({
            //"Aerial": { type: "bing",      id: "AerialWithLabels" },
            //"Roads":  { type: "bing",      id: "Road" },
            "MapBox Pale": { type: "mapbox", id: mapbox_pale},
            "MapBox Bright": { type: "mapbox", id: mapbox_bright}
        }).addTo(map);

        if (minimap) {
            var layer = L.tileLayer("http://{s}.tiles.mapbox.com/v3/" + mapbox_pale + "/{z}/{x}/{y}.png");
            L.extend(L.Control.MiniMap.prototype, {
                hideText: 'Oculta',
                showText: 'Mostra'
            });
            new L.Control.MiniMap(layer, {toggleDisplay: true}).addTo(map);            
        }
       
        return map;
    }
    
    return {
        create: create
    };

});