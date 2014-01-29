define(["messagebus", "template", "jquery"], function(bus, template, $) {

    var field = undefined;

    var fields = [{
        id: "none",
        name: "(sense classificar)"
    }, {
        id: "author",
        name: "Autor"
    }, {
        id: "culture",
        name: "Cultura"
    }, {
        id: "material",
        name: "Material"
    }, {
        id: "objectName",
        name: "Nom de l'objecte"
    }, {
        id: "place",
        name: "Lloc"
    }, {
        id: "technique",
        name: "Tècnica"
    }];

    apply_template().then(add_interactivity);
    
    function apply_template() {
        return template.render("cel.field", fields, "fields");        
    }
    
    function add_interactivity() {
        var links = $("#field-menu > ul > li > a");
       
        links.click(function(e) {
            $("#field-menu .selected").html(this.innerHTML);
            field = $(this).data("field");
            bus.publish("cel.field.selected", field);
        });
        
        links[0].click(); // Select first one on load
    }
    
    return {
        get: function() {
            return field;
        },
        getFieldName: function(id) {
            for (var i in fields) {
                if (fields[i].id == id) {
                    return fields[i].name;
                }
            }
        }
    };
});
