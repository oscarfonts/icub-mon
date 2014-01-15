/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["celapi", "template"], function(celapi, template) {

    function renderObject(object) {
        
        var id = object.idInLocalSource;
                   
        var id_reg = $.grep(object.identifiers, function(e, i) {
                    return e.type.value == "accessionNumber";
                })[0].value;
        
        var name = $.grep(object.objectTypes, function(e, i) {
                    return e.originalType == "Nom de l'objecte";
                })[0].value;

        var creation = $.grep(object.objectInEvents, function(e, i) {
                return (e["function"].value == "created" && e["event"].type.value == "creation");
            })[0].event;
            
        var provenance = $.grep(object.objectInEvents, function(e, i) {
                return (e["function"].value == "found" && e["event"].type.value == "provenance");
            })[0].event;
            
        var history = $.grep(object.objectNotes, function(e, i) {
                    return e.type.value == "history";
                })[0].value;
        
        var description = $.grep(object.objectNotes, function(e, i) {
                    return e.type.value == "description";
                })[0].value;
        
        var usage = $.grep(object.classifications, function(e, i) {
                    return e.type.value == "usage";
                })[0].value;

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
            value: creation.culturesInEvent[0].value
        }/*,{
            key: "Estil",
            value: null
        }*/,{
            key: "Datació",
            value: creation.timesInEvent[0].display
        }/*,{
            key: "Dimensions",
            value: null
        }*/,{
            key: "Material/Tècnica",
            value: creation.usedMaterialTechniques[0].remarks
        },{
            key: "Lloc de procedència",
            value: provenance.placesInEvent[0].value
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
            img_src: "img/peces/" + id + ".JPG",
            properties: properties
        };
        
        template.render("mcm.object", data, "peca");
        
    };

    celapi.object.details("MCM", "africa", "481470").then(renderObject);
    
});
