define(["wysihtml5-ca"], function() {
    
    function editor(div, onSave) {
        
        this.div = div,
        this.editor_id = div + "-editor",
        this.save_id = this.editor_id + "-save",
        this.discard_id = this.editor_id + "-discard",
        this.editor_data = undefined,
        this.on_save = onSave;

        this.show = function() {
            $('#'+this.div).show();
        };
        
        this.hide = function() {
            $('#'+this.div).hide();
        };
 
        this.load = function(data) {
            this.editor_data = data;
            $('#'+this.editor_id).data("wysihtml5").editor.setValue(data.html);
            this.show();
        };
 
        this.hide();
 
        // Create a textarea
        $("#"+div).html('<textarea class="form-control framed" id="' + this.editor_id + '" placeholder="Afegiu-hi un text..." style="width: 100%; height: 400px;"></textarea>');
 
        // Convert to rich html editor
        $('#'+this.editor_id).wysihtml5({
            "font-styles": true,
            "link": true,
            "image": true,
            "color": false,
            "blockquote": false,
            "size": 'sm',
            "locale": "ca-CT"
        });
        
        // Add save & discard buttons
        $('#' + div + ' .wysihtml5-toolbar').append($('<li style="float:right;">')
            .append($('<div class="btn-group">')
                .append('<a id="' + this.save_id + '" class="btn btn-success btn-sm" tabindex="-1" title="Desa" href="javascript:;"><i class="glyphicon glyphicon-ok"></i>&nbsp;Desa</a>')
                .append('<a id="' + this.discard_id + '" class="btn btn-danger btn-sm" tabindex="-1" title="Descarta" href="javascript:;"><i class="glyphicon glyphicon-remove"></i>&nbsp;Descarta</a>')
            )
        );

        $('#'+this.save_id).on("click", null, this, save);
        $('#'+this.discard_id).on("click", null, this, discard);
       
        function save(e) {
            editor = e.data;
            editor.editor_data.html = $('#'+editor.editor_id).val();
            editor.on_save(editor.editor_data);
        }
        
        function discard(e) {
            // Replaces editor's contents with unedited html
            editor = e.data;
            $('#'+editor.editor_id).data("wysihtml5").editor.setValue(editor.editor_data.html);
        }

    };
    
    return editor;

});
