define(["eventbus", "data.contents"], function(events, data) {
    
    function getImageForCulture(cultura_id) {
        var peca = data.getFirstPecaOfCulture(cultura_id);
        var img_src = "static/img/peces/"+peca.id+".JPG";
        return '<img class="tiny" src="'+img_src+'" alt="img"/>'; 
    };
    
    var stylerkit = {
        
        style: null,
        
        stylers: {
            "Imatges a fora, només cultures": {
                active_feature_id: false,                
                getImage: getImageForCulture,
                clusterOptions: function() {
                    var self = this;
                    return {
                        showCoverageOnHover: false,
                        maxClusterRadius: 75,
                        spiderfyDistanceMultiplier: 3,
                        removeOutsideVisibleBounds: false,
                        iconCreateFunction: function (cluster) {
                           return L.divIcon({
                                className: 'mcm-hide-marker',
                                html: self.cluster(cluster.getChildCount())
                            });
                        }
                    };
                },
                cluster: function(count) {
                    return '<div class="btn btn-xs btn-danger">'+count+'</b> cultures</div>';
                },
                contents: function(feature) {
                    var img = this.getImage(feature.id);
                    return '<div class="marker-out" id="marker-cultura-'+feature.id+'">'+img+'<span style="white-space:nowrap;">'+feature.properties.nom+'</span></div>';
                },
                select: function(id) {
                    if (this.active_feature_id) {
                        $("#marker-cultura-"+this.active_feature_id).removeClass("marker-selected"); //.addClass("btn-primary");
                    }
                    this.active_feature_id = id;
                    $("#marker-cultura-"+id).removeClass("btn-primary").addClass("marker-selected");
                }
            },
            "Imatges a fora, tots els markers": {
                active_feature_id: false,
                getImage: getImageForCulture,
                clusterOptions: function() {
                    var self = this;
                    return {
                        showCoverageOnHover: false,
                        maxClusterRadius: 95,
                        spiderfyDistanceMultiplier: 3.5,
                        removeOutsideVisibleBounds: false,
                        iconCreateFunction: function (cluster) {
                           return L.divIcon({
                                className: 'mcm-hide-marker',
                                html: self.cluster(cluster)
                            });
                        }
                    };
                },
                cluster: function(cluster) {
                    var img = this.getImage(cluster.getAllChildMarkers()[0].feature.id);
                    return '<div class="marker-out cluster-out">'+img+'<span style="white-space:nowrap;"><b>'+cluster.getChildCount()+'</b> cultures</span></div>';
                },
                contents: function(feature) {
                    var img = this.getImage(feature.id);
                    return '<div class="marker-out" id="marker-cultura-'+feature.id+'">'+img+'<span style="white-space:nowrap;">'+feature.properties.nom+'</span></div>';
                },
                select: function(id) {
                    if (this.active_feature_id) {
                        $("#marker-cultura-"+this.active_feature_id).removeClass("marker-selected"); //.addClass("btn-primary");
                    }
                    this.active_feature_id = id;
                    $("#marker-cultura-"+id).removeClass("btn-primary").addClass("marker-selected");
                }
            },
            "Imatges a dins": {
                active_feature_id: false,
                getImage: getImageForCulture,
                clusterOptions: function() {
                    var self = this;
                    return {
                        showCoverageOnHover: false,
                        maxClusterRadius: 95,
                        spiderfyDistanceMultiplier: 3.5,
                        removeOutsideVisibleBounds: false,
                        iconCreateFunction: function (cluster) {
                            return L.divIcon({
                                className: 'mcm-hide-marker',
                                html: self.cluster(cluster)
                            });
                        }
                    };
                },
                cluster: function(cluster) {
                    var img = this.getImage(cluster.getAllChildMarkers()[0].feature.id);
                    return '<div class="marker cluster">'+img+'<span style="white-space:nowrap;"><b>'+cluster.getChildCount()+'</b> cultures</span></div>';
                },
                contents: function(feature) {
                    var img = this.getImage(feature.id);
                    return '<div class="marker" id="marker-cultura-'+feature.id+'">'+img+'<span style="white-space:nowrap;">'+feature.properties.nom+'</span></div>';
                },
                select: function(id) {
                    if (this.active_feature_id) {
                        $("#marker-cultura-"+this.active_feature_id).removeClass("marker-selected"); //.addClass("btn-primary");
                    }
                    this.active_feature_id = id;
                    $("#marker-cultura-"+id).removeClass("btn-primary").addClass("marker-selected");
                }
            },
            "Sense imatges": {
                active_feature_id: false,
                clusterOptions: function() {
                    var self = this;
                    return {
                        showCoverageOnHover: false,
                        maxClusterRadius: 75,
                        spiderfyDistanceMultiplier: 3,
                        removeOutsideVisibleBounds: false,
                        iconCreateFunction: function (cluster) {
                           return L.divIcon({
                                className: 'mcm-hide-marker',
                                html: self.cluster(cluster.getChildCount())
                            });
                        }
                    };
                },
                cluster: function(count) {
                    return '<div class="btn btn-xs btn-danger"><b>'+count+'</b> cultures</div>';
                },
                contents: function(feature) {
                    return '<div class="btn btn-xs btn-primary" id="marker-cultura-'+feature.id+'">'+feature.properties.nom+'</div>';
                },
                select: function(id) {
                    if (this.active_feature_id) {
                        $("#marker-cultura-"+this.active_feature_id).removeClass("btn-success").addClass("btn-primary");
                    }
                    this.active_feature_id = id;
                    $("#marker-cultura-"+id).removeClass("btn-primary").addClass("btn-success");
                }
            }
        },
        
        getStyles: function() {
            styles = [];
            
            for (i in this.stylers) {
                styles.push(i);
            }
            return styles;
        },
        
        getStyle: function() {
            return this.style;
        },
               
        setStyle: function(style) {
            if (this.stylers.hasOwnProperty(style)) {
                this.style = style;
                events.send("iconstyle.changed", style);
            } else {
                events.send("error", "Icon Style '"+style+"' not found");
            }
        },

        getStyler: function() {
            return this.stylers[this.style];
        },
        
    };
    
    stylerkit.setStyle(stylerkit.getStyles()[0]);
    
    events.listen("iconstyle.change", function(event, style) {
        this.setStyle(style);
    }, stylerkit);
    
    var styles = stylerkit.getStyles();     
    for (i in styles) {
        var style = styles[i];
        $("#style-chooser").append($('<li>')
            .append($('<a>')
                .append(style)
                .on('click', null, style, function(event) {
                    var style = event.data;
                    events.send("iconstyle.change", event.data);
                })
            )
        );
    };
    
    return stylerkit;
    
});
