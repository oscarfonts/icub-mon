/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet.map", "mcm.api"], function(leaflet, api) {
    
    function map(div) {
        
        this.map = leaflet.create(div);
        this.layer = undefined;
        
        this.showContinents = function() {
            var that = this;
            return api.continent.list().then(
                function(data) {
                    that.loadFeatures.call(that, [data]);
                }, function(error) {
                    that.clearMap.call(that);
                    that.map.fitWorld();
                }
            );
        };
        
        this.showCultures = function(continent_id) {
            var that = this;
            return api.culture.list(continent_id).then(
                function(data) {
                    that.loadFeatures.call(that, [data]);
                }, function(error) {
                    that.clearMap.call(that);
                    that.map.fitWorld();
                }
            );
        };

        this.showCulture = function(culture_id) {
            var that = this;
            return api.culture.get(culture_id).then(
                function(data) {
                    that.loadFeatures.call(that, [data]);
                }, function(error) {
                    that.clearMap.call(that);
                    that.map.fitWorld();
                }
            );
        };
        
        this.showObjects = function(culture_id) {
            var that = this;
            return api.object.list(culture_id).then(
                function(data) {
                    that.loadFeatures.call(that, [data]);
                }, function(error) {
                    that.clearMap.call(that);
                    that.map.fitWorld();
                }
            );
        };

        this.showObject = function(object_id) {
            var that = this;
            return api.object.get(object_id).then(
                function(data) {
                    that.loadFeatures.call(that, [data]);
                }, function(error) {
                    that.clearMap.call(that);
                    that.map.fitWorld();
                }
            );
        };
        
        this.loadFeatures = function(features) {
            this.clearMap();
            this.layer = L.geoJson(features).addTo(this.map);
            this.map.fitBounds(this.layer.getBounds());
            if (this.map.getBoundsZoom(this.layer.getBounds()) > 8) {
                this.map.setView(this.layer.getBounds().getCenter(), 6, {animate: true});
            } else if (this.map.getBoundsZoom(this.layer.getBounds()) < 2) {
                this.map.setView(this.layer.getBounds().getCenter(), 2, {animate: true});
            } else {
                this.map.fitBounds(this.layer.getBounds());
            }

        };
        
        this.clearMap = function() {
           if (this.layer) {
               this.map.removeLayer(this.layer);
           }
        };
    }
    
    return map; 
});
