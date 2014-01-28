/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["cel.api", "template"], function(celapi, template) {

    var div_id = "mcm-object",
        museum_id = "MCM",
        data = [];

    function show(collection, object_id) {
        get_contents(collection, object_id).then(parse_data).then(apply_template);
    }

    function hide() {
        document.getElementById(div_id).innerHTML = "";
    };

    function get_contents(collection, object_id) {
        return celapi.object.details("MCM", collection, object_id);
    }
    
    function first(prop, arr) {
        if(arr && arr.length && arr[0][prop]) {
            return arr[0][prop];
        } else {
            return "";
        }
    }

    function parse_data(object) {
        
        var id = object.idInLocalSource;
                   
        var id_reg = first("value",
            $.grep(object.identifiers, function(e, i) {
                return e.type.value == "accessionNumber";
            }));
        
        var name = first("value",
            $.grep(object.objectTypes, function(e, i) {
                return e.originalType == "Nom de l'objecte";
            }));

        var creation = first("event",
            $.grep(object.objectInEvents, function(e, i) {
                return (e["function"].value == "created" && e["event"].type.value == "creation");
            }));
            
        var provenance = first("event",
            $.grep(object.objectInEvents, function(e, i) {
                return (e["function"].value == "found" && e["event"].type.value == "provenance");
            }));
            
        var history = first("value",
            $.grep(object.objectNotes, function(e, i) {
                return e.type.value == "history";
            }));
    
        var description = first("value",
            $.grep(object.objectNotes, function(e, i) {
                return e.type.value == "description";
            }));
        
        var usage = first("value",
            $.grep(object.classifications, function(e, i) {
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
        
        var data = {
            id: id,
            img_src: "../img/peces/" + id + ".JPG",
            properties: properties
        };
        
        return data;
        
    };

    function apply_template(data) {
        template.render("mcm.object", data, div_id);
    }
    
    return {
        show: show,
        hide: hide,
        setDiv: function(div) {
            div_id = div;
        }
    };
    
});
