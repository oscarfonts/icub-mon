define(["leaflet", "bing"], function(L) {

    var urls = {
        "cloudmade": "http://{s}.tile.cloudmade.com/f9b48b21a87048bfb118148491d22ec5/{styleId}/256/{z}/{x}/{y}.png",
        "mapbox":    "http://{s}.tiles.mapbox.com/v3/{styleId}/{z}/{x}/{y}.png",
        // Bing types: Aerial, AerialWithLabels, Birdseye, BirdseyeWithLabels, Road
        "bing":      "Au0fzRXOjOMS6KE0Z5ZOLjVIt57V1OvnUamDKKs6CaC1-Cx-0_oSFl3J9aIwUgSM"
    };
    
    var attributions = {
        "cloudmade": 'Map data &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap contributors</a>, imagery &copy; <a href="http://cloudmade.com" target="_blank">CloudMade</a>',
        "mapbox": 'Map data &copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap contributors</a>, imagery &copy; <a href="http://mapbox.com" target="_blank">MapBox</a>'
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
