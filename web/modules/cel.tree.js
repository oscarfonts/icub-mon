/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "cel.field", "cel.tree.data", "template", "mcm.i18n"], function(bus, field, data, template, i18n) {

    var div_id = "tree";
    var templ = "cel.tree";
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
        document.getElementById(div_id).innerHTML = '<div class="alert alert-info">' + i18n.translate('download_contents', ' ') + selected.museum.name + '...</div>';
        return data.getContents(selected.museum, selected.field).then(apply_template);
    }
    
    function hide() {
        document.getElementById(div_id).innerHTML = "";
    }
    
    function apply_template(contents) {
        return template.render(templ, contents, div_id).then(add_interactivity);        
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
    
    function select_item(item) {
        var data = $("#"+item.id+" > a").click();
    }
    
    return {
        show: show,
        hide: hide,
        showFieldSelector: function() {
            field.show();
        },
        setField: function(field_id) {
            selected.field = {
                id: field_id,
                name: field.getFieldName(field_id)
            };
        },
        template: function(template) {
            if (template) {
                templ = template;
            }
            return templ;
        },
        div: function(div) {
            if (div) {
                div_id = div;
            }
            return div_id;
        },
        selectItem: select_item
    };
});
