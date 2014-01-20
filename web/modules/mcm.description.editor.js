define(["wysihtml5-ca"], function() {
    function show() {
        details('<div id="editor-container" class="well well-lg"><textarea class="form-control framed" id="editor-cultura" placeholder="Afegiu una descripció per a la cultura ' + cultura.nom + '..." style="width: 100%; height: 400px"></textarea></div>');

        if (cultura.descripcio_html != null) {
            $('#editor-cultura').val(cultura.descripcio_html);
            $('#editor-container').append($('<textarea style="display:none;">')
                .attr("id", "old-text")
                .append(cultura.descripcio_html)
            );
        }

        $('#editor-cultura').wysihtml5({
            "font-styles": false,
            "link": false,
            "image": false,
            "size": 'sm',
            "locale": "ca-CT"
        });

        $('.wysihtml5-toolbar').prepend('<li class="well-title">Descripció de la cultura</li>');
        $('.wysihtml5-toolbar').append($('<li id="editor-actions" style="float:right;">')
            .append($('<div class="btn-group">')
                .append('<a id="editor-save" class="btn btn-success btn-sm" tabindex="-1" title="Desa" href="javascript:;"><i class="glyphicon glyphicon-ok"></i> Desa</a>')
                .append('<a id="editor-discard" class="btn btn-danger btn-sm" tabindex="-1" title="Descarta" href="javascript:;"><i class="glyphicon glyphicon-remove"></i> Descarta</a>')
            )
        );
        $('#editor-container').show();
        
        $('#editor-save').on("click", cultura, function(event, value) {
            var cultura = event.data;
            cultura.descripcio_html = $('#editor-cultura').val();
            $("#editor-cultura").remove();
            events.send("details.setCultura", cultura);

            if ($('#editor-cultura')) {
                $('#editor-cultura').remove();
            }
            if($('editor-container')) {
                $('#editor-container').remove();
            }
        });
        
        $('#editor-discard').on("click", function(event, value) {
            $('#editor-cultura').data("wysihtml5").editor.setValue($('#old-text').val());
        });

        //$('#editor-cultura').val(); // Retrieve value
    }
    
    return {
        show: show
    };
});
