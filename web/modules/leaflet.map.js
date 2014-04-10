/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet", "leaflet.layers", "leaflet-minimap"], function(L, layers) {
    
    var mapbox_bright = "oscarfonts.map-1mujgtmu";
    var mapbox_pale = "oscarfonts.hnmjhnd6";

    function create(id, minimap) {
        var div = id ? id : 'map';

        var map = L.map(div, {
            minZoom: 1,
            maxZoom: 16,
            maxBounds: [[-85, -500], [85, 500]],
            scrollWheelZoom: false,
            center: [10.5, 0],
            zoom: 1
        });
        
        layers.create({
            //"Aerial": { type: "bing", id: "AerialWithLabels"},
            //"Roads":  { type: "bing", id: "Road" },
            "Watercolor": { type: "stamen", id: "watercolor"},
            "Toner": { type: "stamen", id: "toner"},
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