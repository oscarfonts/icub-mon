define(["leaflet"], function(L) {

    var url = 'http://{s}.tile.cloudmade.com/f9b48b21a87048bfb118148491d22ec5/{styleId}/256/{z}/{x}/{y}.png';
    var attribution = 'Map data &copy; OpenStreetMap contributors, imagery &copy; CloudMade';
      
    return {
        layers: function(list) {
            var control = L.control.layers({}, {}, {collapsed: false});
            var layer;

            for (name in list) {
                var id = list[name];
                layer = L.tileLayer(url, {styleId: id,  attribution: attribution});
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
