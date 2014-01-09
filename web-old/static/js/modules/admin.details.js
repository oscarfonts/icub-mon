define(["eventbus", "jquery", "tree", "wysihtml5-ca"], function(events) {

    events.listen("tree.continentSelected", renderContinent);  
    events.listen("tree.culturaSelected", renderCultura);
    events.listen("tree.pecaSelected", renderPeca);
    
    events.listen("data.culturaRead", renderEditor);
    
    title("Món");
    
    function renderContinent(event, continent) {
        title(continent.nom);
        details("");
        tagline("Sel·leccioneu una cultura de la llista");
    };
    
    function renderCultura(event, cultura) {       
        title("Cultura " + cultura.nom + " (" + cultura.id + ")");
        tagline("Editeu la cultura, o sel·leccioneu una peça de la llista");
        
        events.send("details.getCultura", cultura.id);
    };
    
    function renderPeca(event, peca) {
       
        var html = 
             '<div class="framed"><table><tr><td><img src="../static/img/peces/'+peca.id+'.JPG" alt="'+peca.num_registre+'"></td>' +
             '<td><ul><li><b>Procedència:</b> '+peca.procedencia+'</li>';
        if (peca.precisions_procedencia.length) {
             html +='<li><b>Precisions procedència:</b> '+peca.precisions_procedencia+'</li>';
        }
        html += '<li><b>Datació:</b> '+peca.datacio+'</li>' +
             '<li><b>Any inicial:</b> '+peca.any_inici+'</li>' +
             '<li><b>Any final:</b> '+peca.any_final+'</li></ul></td></tr></table></div>';

        title("Peça " + peca.num_registre);
        details(html);
        tagline("Dibuixeu l'àmbit geogràfic de la peça");
    };
    
    function renderEditor(event, cultura) {
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
    };
    
    function title(text) {
        $('#title').html(text);
    };
   
    function tagline(text) {
        $('#tagline').html(text);
    };
   
    function details(text) {
        $('#details').html(text);
    };

});