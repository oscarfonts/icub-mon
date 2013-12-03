define(["eventbus", "data.contents", "data.feature", "timeline", "bootstrap-lightbox"], function(events, data, features, timeline) {
    events.listen("state.featureChanged", renderCultura);
    
    function renderCultura(event, id) {
        var cultura = data.get("cultures", id);
        features.get("cultura", id, renderCulturaDescription);
        description(' \
            <h1 class="page-header">Cultura '+cultura.nom+'</h1> \
            <div class="row"> \
              <div class="col-sm-6"> \
                <div class="well well-lg" id="cultura-description"> \
                  <i>Sense descripció</i></div> \
              </div> \
              <div class="col-sm-6"> \
                <div id="items"></div> \
              </div> \
            </div>'
         );
        data.list("peca", {"filters":[{"name":"cultura","op":"==","val":cultura.id}]}, renderPeces);
        
        $('html, body').animate({
            scrollTop: $("#description").offset().top
        }, 1000);
    };
    
    function renderCulturaDescription(feature) {
        if (feature.properties.descripcio_html != null) {
            $("#cultura-description").html(feature.properties.descripcio_html);    
        }        
    };

    function renderPeces(peces) {
        
        var collection = [];
        for (i in peces) {
            var peca = peces[i];
            var img_src = "static/img/peces/"+peca.id+".JPG";
            
            var html = ' \
                <div class="media"> \
                    <a class="pull-left" data-toggle="lightbox" href="#img_'+peca.num_registre.replace(/ /g,"_")+'"> \
                        <img class="media-object img-thumbnail" src="'+img_src+'" alt="'+peca.num_registre+'"> \
                    </a> \
                    <h4 class="media-heading">'+peca.nom;
                    if (peca.nom_vernacle) {
                        html += ' ('+peca.nom_vernacle+')';
                    }
                    html += '</h4> \
                    <div class="media-body"> \
                        <div><b>Procedència:</b> '+peca.procedencia;
                        if (peca.precisions_procedencia.length) {
                             html +=', '+peca.precisions_procedencia;
                        }
            html += '   </div> \
                        <div><b>Material</b>: '+peca.precisions_material+'</div> \
                        <div><b>Núm registre</b>: '+peca.num_registre+'</div> \
                        <div id="timeline'+peca.id+'"></div> \
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
        timeline.draw(peces);
    }
    
    function description(text) {
        $('#description').html('<div class="description">'+text+'</div>');
    }
    
    function items(collection) {
        $('#items').html('<div class="items">'+collection.join("")+'</div>');
    }
    
});
