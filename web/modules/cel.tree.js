/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "cel.field", "cel.tree.data", "template"], function(bus, field, data, template) {

    var div_id = "tree";
    var selected = {
            museum: undefined,
            field: undefined
        };
    
    bus.subscribe("cel.field.selected", function(field) {
        selected.field = field;
        if (selected.museum) {
            show(selected.museum, selected.field);
        }
    });
    
    function show(museum) {
        selected.museum = museum;
        document.getElementById(div_id).innerHTML = '<div class="alert alert-info">Descarregant continguts del ' + selected.museum.name + '...</div>';
        return data.getContents(selected.museum, selected.field).then(apply_template);
    }
    
    function hide() {
        document.getElementById(div_id).innerHTML = "";
    }
    
    function apply_template(contents) {
        return template.render("cel.tree", contents, div_id).then(add_interactivity);        
    }
    
    function add_interactivity() {
        $("#tree a").click(function() {
            var li = $(this).parent();
            var type = li.attr("class");
            var value = li.data("tree");
            
            if(type.indexOf(" active") == -1) {               
                $("#tree .active").removeClass("active");
                if (type == "collection") {
                    $("#tree .in").removeClass("in").addClass("collapse");
                } else {
                    $("#tree > li > ul > li .in").removeClass("in").addClass("collapse");
                }
                li.addClass("active");

                bus.publish("cel.tree.selected", {
                    type: type,
                    value: value
                });
            }
        });
    };
    
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
