/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet.map", "mcm.api", "messagebus"], function(leaflet, api, bus) {
    
    function map(div) {
    
        var styles = {
            "default": {
                color: '#AA8800',
                weight: 2,
                opacity: 1,
                fillColor: '#AA8800',
                fillOpacity: 0.6
            },    
            hover: {
                weight: 2,
                color: '#CCFF00',
                fillColor: '#CCFF00'
            }
        };
        
        function highlightFeature(e) {
            var layer = e.target;
            if (layer.setStyle) {
                layer.setStyle(styles.hover);
                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }
            }
            bus.publish("mcm.map.hovered", item(layer.feature));
        }
        
        function resetHighlight(e) {
            var layer = e.target;
            if (layer.setStyle) {
                layer.setStyle(styles["default"]);
                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }
            }
            bus.publish("mcm.map.unhovered", item(layer.feature));
        }
        
        function selectFeature(e) {
            bus.publish("mcm.map.selected", item(e.target.feature));
        }
        
        function item(feature) {
            var id = feature.id || feature.properties.id;
            var type = undefined;
            if (feature.properties.hasOwnProperty("name")) {
                type = "continent";
            } else if (feature.properties.hasOwnProperty("continent")) {
                type = "culture";
            } else if (feature.properties.hasOwnProperty("culture")) {
                type = "object";
            }
            return {
                id: id,
                type: type
            };
        }
               
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
            var that = this;
            this.layer = L.geoJson(features, {
                style: styles["default"],
                onEachFeature: function(feature, layer) {
                    layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: selectFeature
                },undefined,that); }
            }).addTo(this.map);
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
