/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet", "bing"], function(L) {

    var urls = {
        "mapbox":    "http://{s}.tiles.mapbox.com/v3/{styleId}/{z}/{x}/{y}.png",
        "stamen":     "http://{s}.tile.stamen.com/{styleId}/{z}/{x}/{y}.png",
        // Bing types: Aerial, AerialWithLabels, Birdseye, BirdseyeWithLabels, Road
        "bing":      "Au0fzRXOjOMS6KE0Z5ZOLjVIt57V1OvnUamDKKs6CaC1-Cx-0_oSFl3J9aIwUgSM"
    };
    
    var attributions = {
        "mapbox": 'Map data &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap contributors</a>, imagery &copy; <a href="http://mapbox.com" target="_blank">MapBox</a>',
        "stamen": 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    };
    
    return {
        create: function(list) {
            var control = L.control.layers();
            var layer;

            for (name in list) {
                var def = list[name];
                switch (def.type) {
                    case "bing":
                        layer = new L.BingLayer(urls[def.type], {type: def.id, culture: 'es-ES'});                   
                        break;
                    default:
                        layer = L.tileLayer(urls[def.type], {styleId: def.id, attribution: attributions[def.type]});                    
                        break;
                };
                control.addBaseLayer(layer, name);
            }
            
            return {
                control: control,
                activeLayer: layer,
                addTo: function(map) {
                    map.addControl(this.control);
                    map.addLayer(this.activeLayer);
                }
            };
        }
    };

});
