/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["cel.api", "template"], function(celapi, template) {

    var div_id = "detail";

    function show(museum_id, collection_id, object_id) {
        document.getElementById(div_id).innerHTML = '<div class="alert alert-info">Descarregant detalls de la peça ' + object_id + '...</div>';
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

        var creation = first("event",
            $.grep(detail.objectInEvents, function(e, i) {
                return (e["function"].value == "created" && e["event"].type.value == "creation");
            }));
            
        var provenance = first("event",
            $.grep(detail.objectInEvents, function(e, i) {
                return (e["function"].value == "found" && e["event"].type.value == "provenance");
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

        var properties = [{
            key: "Núm. Registre",
            value: id_reg
        },{
            key: "Nom de l'objecte",
            value: name
        }/*,{
            key: "Nom vernacle",
            value: null
        }*//*,{
            key: "Títol/nom propi",
            value: null
        }*/,{
            key: "Cultura",
            value: first("value", creation.culturesInEvent)
        }/*,{
            key: "Estil",
            value: null
        }*/,{
            key: "Datació",
            value: first("display", creation.timesInEvent)
        }/*,{
            key: "Dimensions",
            value: null
        }*/,{
            key: "Material/Tècnica",
            value: first("remarks", creation.usedMaterialTechniques)
        },{
            key: "Lloc de procedència",
            value: first("value", provenance.placesInEvent)
        }/*,{
            key: "Ingrés",
            value: null
        }*/,{
            key: "Història de l'objecte",
            value: history
        },{
            key: "Descripció",
            value: description
        },{
            key: "Context d'utilització",
            value: usage
        }];
        
        var plain = {
            id: id,
            img_src: "../img/peces/" + id.substr(1) + ".JPG",
            properties: properties
        };
        
        return plain;
        
    };

    function apply_template(plain) {
        template.render("cel.detail", plain, div_id);
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
