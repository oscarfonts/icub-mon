define(["eventbus", "data.contents", "timeline", "bootstrap-lightbox"], function(events, data, timeline) {
    events.listen("culturaSelected", renderCultura);
       
    function renderCultura(event, feature) {
        description(' \
            <h1 class="page-header">'+feature.properties.nom+'</h1> \
            <p><i>Aquí hi va un text descriptiu d\'aquesta cultura, que s\'ha de veure d\'on el treiem (gestor de continguts?)</i></p> \
            <h1 class="page-header"><small>Cronograma de les peces</small></h1> \
            <div id="timeline"></div> \
            <h1 class="page-header"><small>Detall de les peces</small></h1> \
            <div id="items"></div>'
         );
        data.list("peca", {"filters":[{"name":"cultura","op":"==","val":feature.id}]}, renderPeces);
    };

    function renderPeces(peces) {
        timeline.draw(peces);
        
        var collection = [];
        for (i in peces) {
            var peca = peces[i];
            var img_src = "static/img/peces/"+peca.id+".JPG";
            
            var html = ' \
                <div class="media"> \
                    <a class="pull-left" data-toggle="lightbox" href="#img_'+peca.num_registre.replace(/ /g,"_")+'"> \
                        <img class="media-object img-thumbnail" src="'+img_src+'" alt="'+peca.num_registre+'"> \
                    </a> \
                    <div class="media-body"> \
                        <h4 class="media-heading">'+peca.num_registre+'</h4> \
                        <ul> \
                            <li><b>Procedència:</b> '+peca.procedencia+'</li>';
            if (peca.precisions_procedencia.length) {
                 html +='<li><b>Precisions procedència:</b> '+peca.precisions_procedencia+'</li>';
            }
            html += ' \
                            <li><b>Datació:</b> '+peca.datacio+'</li> \
                            <li><b>Any inicial:</b> '+peca.any_inici+'</li> \
                            <li><b>Any final:</b> '+peca.any_final+'</li> \
                        </ul> \
                    </div> \
                </div> \
                <div id="img_'+peca.num_registre.replace(/ /g,"_")+'" class="lightbox fade" tabindex="-1" role="dialog" aria-hidden="true"> \
                    <div class="lightbox-dialog"> \
                        <div class="lightbox-content"> \
                            <img src="'+img_src+'" alt="'+peca.num_registre+'"> \
                        </div> \
                    </div> \
                </div>';
            
            collection.push('<div>'+html+'</div>');
        }
        
        items(collection);
    }
    
    function description(text) {
        $('#description').html('<div class="description">'+text+'</div>');
    }
    
    function items(collection) {
        $('#items').html('<div class="items">'+collection.join("")+'</div>');
    }
    
});
