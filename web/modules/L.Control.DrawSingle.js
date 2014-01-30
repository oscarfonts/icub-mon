/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
L.drawLocal = {
    draw: {
        toolbar: {
            actions: {
                title: 'Cancel·la el dibuix',
                text: 'Cancel·la'
            },
            buttons: {
                polyline: 'Afegeix una línia',
                polygon: 'Afegeix un polígon',
                rectangle: 'Afegeix un rectangle',
                circle: 'Afegeix un cercle',
                marker: 'Afegeix un punt'
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: 'Feu clic i arrossegueu per dibuixar el cercle'
                }
            },
            marker: {
                tooltip: {
                    start: 'Feu clic al mapa per situar el marcador'
                }
            },
            polygon: {
                tooltip: {
                    start: 'Feu clic per començar a dibuixar el polígon',
                    cont: 'Continueu fent clics per afegir més vèrtexs',
                    end: 'Feu clic sobre el primer punt per tancar el polígon'
                }
            },
            polyline: {
                error: '<strong>Error:</strong> no està permès el creuament de línies!',
                tooltip: {
                    start: 'Feu clic per començar a dibuixar la línia',
                    cont: 'Continueu fent clics per afegir més vèrtexs',
                    end: 'Feu clic sobre el darrer punt per finalitzar el dibuix'
                }
            },
            rectangle: {
                tooltip: {
                    start: 'Feu clic i arrossegueu per dibuixar el rectangle'
                }
            },
            simpleshape: {
                tooltip: {
                    end: 'Deixeu anar el botó del ratolí per finalitzar el dibuix'
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: 'Desa els canvis',
                    text: 'Desa'
                },
                cancel: {
                    title: 'Cancel·la l\'edició i descarta els canvis',
                    text: 'Cancel·la'
                }
            },
            buttons: {
                edit: 'Edita la geometria',
                editDisabled: 'Edita la geometria',
                remove: 'Esborra la geometria',
                removeDisabled: 'Esborra la geometria'
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: 'Arrossegueu els punts de control o el marcador',
                    subtext: 'Feu clic a "Cancel·la" per desfer els canvis'
                }
            },
            remove: {
                tooltip: {
                    text: 'Feu clic sobre una geometria per esborrar-la'
                }
            }
        }
    }
};

L.Control.DrawSingle = L.Control.Draw.extend({
    initialize: function (options) {
        L.Control.Draw.prototype.initialize.call(this, options);
        this._featureGroup = this.options.edit.featureGroup;
    },
    
    onAdd: function (map) {
        var container = L.Control.Draw.prototype.onAdd.call(this, map);
        for (var toolbarId in this._toolbars) {
            var tb = this._toolbars[toolbarId];
            if (tb instanceof L.DrawToolbar) {
                this._drawToolbar = tb;
            } else if (tb instanceof L.EditToolbar) {
                this._editToolbar = tb;
            }
        }
        
        this.hide();
        this._featureGroup.on('layeradd layerremove', this.show, this);
        
        return container;
    },
    
    onRemove: function () {
        this._featureGroup.off('layeradd layerremove', this.show, this);
        L.Control.Draw.prototype.onRemove.call(this);
    },
    
    hide: function() {
        this._hideToolbar(this._drawToolbar);
        this._hideToolbar(this._editToolbar);        
    },
    
    show: function() {
        var hasFeatures = this._featureGroup.getLayers().length !== 0;
        if (hasFeatures) {
            this._hideToolbar(this._drawToolbar);
            this._showToolbar(this._editToolbar);
        } else {
            this._showToolbar(this._drawToolbar);
            this._hideToolbar(this._editToolbar);
        }
    },
    
    _showToolbar: function(toolbar) {
        toolbar._toolbarContainer.style.display = 'block';
    },
    
    _hideToolbar: function(toolbar) {
        toolbar._toolbarContainer.style.display = 'none';
    }
});
