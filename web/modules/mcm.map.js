/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet.map", "mcm.api", "messagebus"], function(leaflet, api, bus) {
    
    function map(div) {
    
        var styles = {
            "default": {
                //stroke: false,
                color: '#AA8800',
                opacity: 0.4,
                weight: 10,
                fillCcolor: '#AA8800',
                fillOpacity: 0.8,
            },    
            hover: {
                color: '#CCFF00',
                fillCcolor: '#CCFF00'
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
                    that.loadFeatures.call(that, data, "continents");
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
                    that.loadFeatures.call(that, data, "cultures");
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
                    that.loadFeatures.call(that, data, "culture");
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
                    that.loadFeatures.call(that, data, "objects");
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
                    that.loadFeatures.call(that, data, "object");
                }, function(error) {
                    that.clearMap.call(that);
                    that.map.fitWorld();
                }
            );
        };
        
        this.loadFeatures = function(features, type) {
            var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            this.clearMap();
            var that = this;
            var group = L.featureGroup();
            this.layer = L.geoJson(features, {
                style: styles["default"],
                onEachFeature: function(feature, layer) {
                    if (type == "cultures") {
                        if (!(layer instanceof L.Marker)) {
                            layer = L.marker(layer.getBounds().getCenter());
                            layer.feature = feature;
                        }
                        var data = $("#"+feature.id).data("tree");
                        var label = data ? data.value : feature.id;
                        layer.setIcon(
                            L.divIcon({
                                className: 'mcm-hide-marker',
                                html: '<div class="btn btn-xs btn-primary" id="marker-cultura-'+feature.id+'">'+label+'</div>'
                            })
                        );
                    }
                    
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: selectFeature
                    },undefined,that);
                    group.addLayer(layer);
                    return layer;
                }
            });
            this.layer = group;
            group.addTo(this.map);
                        
            // Set zoom
            this.map.fitBounds(this.layer.getBounds());
            if (this.map.getBoundsZoom(this.layer.getBounds()) > 8) {
                this.map.setView(this.layer.getBounds().getCenter(), 6, {animate: true});
            } else if (this.map.getBoundsZoom(this.layer.getBounds()) < 2) {
                this.map.setView(this.layer.getBounds().getCenter(), 3, {animate: true});
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
