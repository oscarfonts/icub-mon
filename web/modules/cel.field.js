define(["messagebus", "template", "jquery"], function(bus, template, $) {

    var field = undefined;

    apply_template().then(add_interactivity);
    
    function apply_template() {
        var fields = [{
            id: "none",
            name: "(sense agrupar)"
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
        }
    };
});
