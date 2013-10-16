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
