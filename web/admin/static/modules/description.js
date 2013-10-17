define(["eventbus", "jquery", "tree"], function(events) {

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
        details("");
        tagline("Dibuixeu l'àmbit geogràfic de la cultura, o sel·leccioneu una peça de la llista");
    };
    
    function renderPeca(event, peca) {
       
        var html = 
             '<div><table><tr><td><img src="../static/imatges/'+peca.id+'.JPG" alt="'+peca.num_registre+'"></td>' +
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
