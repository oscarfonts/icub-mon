define(["eventbus", "jquery", "tree", "wysihtml5-ca"], function(events) {

    events.listen("tree.continentSelected", renderContinent);  
    events.listen("tree.culturaSelected", renderCultura);
    events.listen("tree.pecaSelected", renderPeca);
    
    title("Món");
    
    function renderContinent(event, continent) {
        title(continent.nom);
        details("");
        tagline("Sel·leccioneu una cultura de la llista");
    };
    
    function renderCultura(event, cultura) {
        title("Cultura " + cultura.nom + " (" + cultura.id + ")");
        details('<div class="well well-lg"><textarea class="form-control framed" id="editor-cultura" placeholder="Afegiu una descripció per a la cultura ' + cultura.nom + '..." style="width: 100%; height: 400px"></textarea></div>');
        tagline("Editeu la cultura, o sel·leccioneu una peça de la llista");
        
        // Opcions de l'editor
        $('#editor-cultura').wysihtml5({
            "font-styles": false, //Font styling, e.g. h1, h2, etc. Default true
            "emphasis": true, //Italics, bold, etc. Default true
            "lists": true, //(Un)ordered lists, e.g. Bullets, Numbers. Default true
            "html": false, //Button which allows you to edit the generated HTML. Default false
            "link": false, //Button to insert a link. Default true
            "image": false, //Button to insert an image. Default true,
            "color": false, //Button to change color of font
            "size": 'sm', //Button size like sm, xs etc.
            "locale": "ca-CT"
            /* EVENTS! https://github.com/xing/wysihtml5/wiki/Events#list-of-supported-events
            "events": {
                "load": function() { 
                    console.log("Loaded!");
                },
                "blur": function() { 
                    console.log("Blured");
                }
            }
            */
        });
        
        $('.wysihtml5-toolbar').prepend('<li class="well-title">Descripció de ' + cultura.nom + '</li>');
        
        $('.wysihtml5-toolbar').append($('<li style="float:right;">')
            .append($('<div class="btn-group">')
                .append('<a class="btn btn-success btn-sm" tabindex="-1" title="Desa" href="javascript:;"><i class="glyphicon glyphicon-ok"></i> Desa</a>')
                .append('<a class="btn btn-danger btn-sm" tabindex="-1" title="Descarta" href="javascript:;"><i class="glyphicon glyphicon-remove"></i> Descarta</a>')
            )
        );
        
        //$('#editor-cultura').val(); // Retrieve value
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
