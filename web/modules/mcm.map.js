/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["leaflet.map", "mcm.api", "messagebus", "tinycolor", "leaflet-label"], function(leaflet, api, bus, color) {

    function map(div) {

        var styles = {
            "default": {
                color: '#AA8800',
                weight: 1,
                opacity: 1,
                fillColor: '#AA8800',
                fillOpacity: 0.6
            },
            hover: {
                weight: 1,
                color: '#CCFF00',
                fillColor: '#CCFF00'
            }
        };

        var colors = {
            africa: color({r: 235, g: 98, b: 9}),
            america: color({r: 102, g: 61, b: 0}),
            asia: color({r: 185, g: 56, b: 40}),
            oceania: color({r: 211, g: 157, b: 34})
        };

        for (var c in colors) {
            var style = JSON.parse(JSON.stringify(styles["default"]));
            style.color = style.fillColor = colors[c].toHexString();
            styles[c] = style;
        }

        function highlightFeature(e) {
            var layer = e.target;
            var style = styles[layer.feature.id];
            if (layer.setStyle && style) {
                var style = JSON.parse(JSON.stringify(style)); // Clone style object
                style.color = style.fillColor = color.lighten(style.color, 25).toHexString();
                layer.setStyle(style);
                if (!L.Browser.ie && !L.Browser.opera) {
                    layer.bringToFront();
                }
            }
            bus.publish("mcm.map.hovered", item(layer.feature));
        }

        function resetHighlight(e) {
            var layer = e.target;
            var style = styles[layer.feature.id];
            if (layer.setStyle && style) {
                layer.setStyle(style);
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

        this.layer = undefined;

        this.showContinents = function() {
            this.createMap(div);
            var that = this;
            return api.continent.list().then(function(data) {
                that.loadFeatures.call(that, data, "continents");
            }, function(error) {
                that.clearMap.call(that);
                that.map.fitWorld();
            });
        };

        this.showCultures = function(continent_id) {
            var that = this;
            return api.culture.list(continent_id).then(function(data) {
                that.loadFeatures.call(that, data, "cultures");
            }, function(error) {
                that.clearMap.call(that);
                that.map.fitWorld();
            });
        };

        this.showCulture = function(culture_id) {
            var that = this;
            return api.culture.get(culture_id).then(function(data) {
                that.loadFeatures.call(that, data, "culture");
            }, function(error) {
                that.clearMap.call(that);
                that.map.fitWorld();
            });
        };

        this.showObjects = function(culture_id) {
            var that = this;
            return api.object.list(culture_id).then(function(data) {
                that.loadFeatures.call(that, data, "objects");
            }, function(error) {
                that.clearMap.call(that);
                that.map.fitWorld();
            });
        };

        this.showObject = function(object_id) {
            var that = this;
            return api.object.get(object_id).then(function(data) {
                that.loadFeatures.call(that, data, "object");
            }, function(error) {
                that.clearMap.call(that);
                that.map.fitWorld();
            });
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

            // Blur culture polygons, except for IE < 10)
            if (!document.querySelector("html.lt-ie10")) {
                if (type == "culture") {
                    if (!L.DomUtil.hasClass(this.map._panes.overlayPane, "blur")) {
                        if ($.browser.webkit) {
                            // In webkit browsers, recreate the entire map, to apply blur filter correctly (bug!)
                            this.createMap(div);
                        }
                        L.DomUtil.addClass(this.map._panes.overlayPane, "blur");
                    }
                } else {
                    L.DomUtil.removeClass(this.map._panes.overlayPane, "blur");
                }
            }
            var that = this;
            var group = L.featureGroup();
            this.layer = L.geoJson(features, {
                style: function(feature) {
                    var style = styles["default"];
                    if (type == "continents") {
                        style = styles[feature.id]; 
                    } else if (type == "culture") {
                        style = JSON.parse(JSON.stringify(styles[feature.properties.continent]));
                        style.weight = 0; // No border for single culture
                    }
                    return style;
                },
                onEachFeature: function(feature, layer) {
                    if (type == "cultures") {
                        var data = $("#" + feature.id).data("tree");
                        var label = data ? data.value : feature.id;
                        if (!( layer instanceof L.Marker)) {
                            layer = L.marker(layer.getBounds().getCenter(), {riseOnHover: true});
                            layer.feature = feature;
                        }
                        var border = color(colors[feature.properties.continent]);
                        var background = color(colors[feature.properties.continent]);
                        background.setAlpha(0.6);
                        layer.setIcon(L.divIcon({
                            className: 'mcm-hide-marker',
                            html: '<div class="circle" style="background-color: ' + background.toRgbString() + ';border-color: ' + border.toRgbString() + '" id="marker-cultura-' + feature.id + '"></div>'
                        }));
                        layer.bindLabel(label);
                    }
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: selectFeature
                    }, undefined, that);
                    group.addLayer(layer);
                    return layer;
                }
            });
            this.layer = group;
            group.addTo(this.map);

            // Set zoom to fit bounds
            this.map.options.maxZoom = 16;
            if (type == "culture") {
                this.map.addOneTimeEventListener("zoomend", function() {
                    this.options.maxZoom = Math.min(this.getZoom(), 16);
                });
            }
            this.map.fitBounds(this.layer.getBounds());

        };

        this.clearMap = function() {
            if (this.layer) {
                this.map.removeLayer(this.layer);
            }
        };

        this.createMap = function(div) {
            var box = $("#"+div).parent();
            box.html("");
            jQuery('<div/>', {
                id: div
            }).appendTo(box);
            this.map = leaflet.create(div, true);
        };
        
        this.redraw = function() {
            this.map.invalidateSize(false);
        };
        
    }

    return map;
});
