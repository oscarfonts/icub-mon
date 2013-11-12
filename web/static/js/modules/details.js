define(["eventbus", "data.contents", "data.feature", "timeline", "bootstrap-lightbox"], function(events, data, features, timeline) {
    events.listen("state.featureChanged", renderCultura);
    
    function renderCultura(event, id) {
        var cultura = data.get("cultures", id);
        features.get("cultura", id, renderCulturaDescription);
        description(' \
            <h1 class="page-header">'+cultura.nom+'</h1> \
            <div class="row"> \
              <div class="col-sm-6"> \
                <h1 class="page-header"><small>Descripció de la cultura</small></h1> \
                <div class="well well-lg" id="cultura-description"><i>Sense descripció</i></div> \
              </div> \
              <div class="col-sm-6"> \
                <h1 class="page-header"><small>Detall de les peces</small></h1> \
                <div id="items"></div> \
                <h1 class="page-header"><small>Cronologia de les peces</small></h1> \
                <div id="timeline"></div> \
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
