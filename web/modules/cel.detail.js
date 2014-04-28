/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["mcm.i18n", "cel.api", "template", "messagebus"], function( i18n, celapi, template, bus) {

    var div_id = "detail";

    function show(museum_id, collection_id, object_id) {
        document.getElementById(div_id).innerHTML = '<div class="alert alert-info">' + i18n.translate('download_details_piece', ' ') + object_id + '...</div>';
        return celapi.object.details(museum_id, collection_id, object_id).then(parse_data).then(apply_template);
    }

    function hide() {
        document.getElementById(div_id).innerHTML = "";
    };
    
    function first(prop, arr) {
        if(arr && arr.length && arr[0][prop]) {
            return arr[0][prop];
        } else {
            return "";
        }
    }
    
    function strip_voids(arr) {
        return $.grep(arr, function(elem) {
            return elem.value;
        });
    }

    function parse_data(detail) {
        
        var plain = [];
        
        var id = detail.idInLocalSource;
                   
        var id_reg = first("value",
            $.grep(detail.identifiers, function(e, i) {
                return e.type.value == "accessionNumber";
            }));
        
        var name = first("value",
            $.grep(detail.objectTypes, function(e, i) {
                return e.originalType == "Nom de l'objecte";
            }));
        
        var vernacular = first("value",
            $.grep(detail.nameOrTitles, function(e, i) {
                return e.type.value == "vernacular";
            }));

        var creation = first("event",
            $.grep(detail.objectInEvents, function(e, i) {
                return (e["function"].value == "created" && e["event"].type.value == "creation");
            }));
            
        var provenances = first("event",
            $.grep(detail.objectInEvents, function(e, i) {
                return (e["function"].value == "found" && e["event"].type.value == "provenance");
            }));
        
        var provenance = first("value",
            $.grep(provenances.placesInEvent, function(e, i) {
                return e.originalType == "Lloc procedència";
            }));
        
        var provenance_precisions = first("value",
            $.grep(provenances.placesInEvent, function(e, i) {
                return e.originalType.indexOf("Precisions al lloc de procedència") !=-1;
            }));

        var history = first("value",
            $.grep(detail.objectNotes, function(e, i) {
                return e.type.value == "history";
            }));
    
        var description = first("value",
            $.grep(detail.objectNotes, function(e, i) {
                return e.type.value == "description";
            }));
        
        var usage = first("value",
            $.grep(detail.classifications, function(e, i) {
                return e.type.value == "usage";
            }));
            
        var citation = first("value",
            $.grep(detail.relatedDocuments, function(e, i) {
                return e.type.value == "citation";
            }));

        var main_image;
        var other_images = [];
        for (var i in detail.relatedMedia) {
            var media = detail.relatedMedia[i];
            if (media.preferred && media.preferred.value == "preferred") {
                main_image = media.URL;
            } else {
                other_images.push(media.URL);
            }
        }

        var short_fields = [{
            key: "Núm. Registre",
            value: id_reg
        },{
            key: "Nom de l'objecte",
            value: name
        },{
            key: "Nom vernacle",
            value: vernacular
        }/*,{
            key: "Títol/nom propi",
            value: null
        }*//*,{
            key: "Sèrie/conjunt",
            value: null
        }*/,{
            key: "Cultura",
            value: first("value", creation.culturesInEvent)
        },{
            key: "Datació",
            value: first("display", creation.timesInEvent)
        }/*,{
            key: "Inscripció", // inscriptionOrMarks...
            value: null
        }*//*,{
            key: "Dimensions", // objectMeasurements...
            value: null
        }*/,{
            key: "Material/Tècnica",
            value: first("remarks", creation.usedMaterialTechniques)
        }/*,{
            key: "Estil",
            value: null
        }*/,{
            key: "Lloc de procedència",
            value: provenance
        },{
            key: "Precisions al lloc de procedència",
            value: provenance_precisions
        }/*,{
            key: "Geografia Històrica",
            value: null
        }*//*,{
            key: "Precisions a l'ingrés",
            value: null
        }*/];
        
        var long_fields = [{
            key: "Història de l'objecte",
            value: history
        },{
            key: "Descripció",
            value: description
        },{
            key: "Context d'utilització",
            value: usage
        },{
            key: "Bibliografia",
            value: citation
        }/*,{
            key: "Exposicions",
            value: null
        }*/];
        
        var count = 0;
        
        var plain = {
            id: id,
            title: name,
            collection: detail.collection,
            main_image: main_image,
            other_images: other_images,
            has_images: function() {return(main_image);},
            short_fields: strip_voids(short_fields),
            long_fields: strip_voids(long_fields),
            counter: function() {return count++;},
            reset_counter: function() {count=0;}
        };
        
        return plain;
        
    };

    function apply_template(plain) {
        template.render("cel.detail", plain, div_id).then(add_interactivity);
    }
    
    function add_interactivity() {
        bus.publish("cel.detail.toggle", true);
        $("#"+div_id+" button.close").click(function() {
            bus.publish("cel.detail.toggle", false);
        });
        /* Uncomment to disable auto-sliding or to set a custom slide time 
        $('#carousel-detail').carousel({
            interval: false // milliseconds
        });
        */
    }
    
    return {
        show: show,
        hide: hide,
        div: function(div) {
            if (div) {
                div_id = div;
            }
            return div_id;
        }
    };
});
