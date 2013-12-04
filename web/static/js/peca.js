var LIB_PATH = "../lib/";

require.config({
    baseUrl : "static/js/modules/",
    paths : {
        "jquery": LIB_PATH + "jquery",
        "bootstrap": LIB_PATH + "bootstrap",
        "bootstrap-lightbox": LIB_PATH + "bootstrap-lightbox",
        "leaflet": LIB_PATH + "leaflet-src",
        "bing": LIB_PATH + "Bing",
        "ie8.html5shiv": LIB_PATH + "html5shiv",
        "ie8.respond": LIB_PATH + "respond.min",
        "chap-timeline": LIB_PATH + "timeline"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "bootstrap-lightbox": {
            deps: ["bootstrap"]
        },
        "bing": {
            deps: ["leaflet"]
        },
        "markercluster": {
            deps: ["leaflet"]
        }
    },
    config: {
        "data.contents": {
            api_url: "api/"
        },
        "data.feature": {
            category: "feature"
        }
    }
});

require(["eventbus", "data.feature"], function(events, features) {
    if (document.getElementsByClassName("lt-ie9").length) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
    
    var labels = {
        num_registre: "Núm. Registre",
        nom: "Nom de l'objecte",
        nom_vernacle: "Nom vernacle",
        titol: "Títol/Nom propi",
        cultura: "Cultura",
        //estil: "Estil",
        datacio: "Datació",
        dimensions: "Dimensions",
        precisions_material: "Material/Tècnica",
        procedencia: "Lloc de procedència",
        precisions_ingres: "Ingrés",
        historia_objecte: "Història de l'objecte",
        descripcio_sinopsi: "Descripció",
        context_utilitzacio: "Context d'utilització"
    };
    
    var id = getURLParameter("id");
    if (id) {
        features.get("peca", id, renderPeca);
    } else {
        $("#peca").html("Error: Cal indicar un identificador de peça.");
    }
    
    function renderPeca(feature) {
        var html = "<dl class='descripcio_peca'>";
        var img_src = "static/img/peces/"+feature.id+".JPG";
        html += '<div class="pull-right"> \
                    <img class="media-object img-thumbnail" src="'+img_src+'" alt="'+feature.properties.num_registre+'"> \
                </div>';
        for (key in labels) {
            // TODO Use culture name, not culture id. Link back to culture.
            if (labels[key] && feature.properties[key]) {
                html += "<dt>"+labels[key]+": </dt>";
                html += "<dd>"+feature.properties[key]+"</dd>";
            }
        }
        html += "</dl>";
        $("#peca").html(html);        
        //$("#peca").html(JSON.stringify(feature));
    }

    function getURLParameter(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    }
    
    events.listen("error", function(event, message) {
        $("#peca").html("Error recuperant peça amb id " + id);
    });
    
});
