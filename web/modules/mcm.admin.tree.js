/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["mcm.i18n", "cel.api", "template", "messagebus", "slug", ], function(celapi, template, bus, slug, i18n) {

    var div_id = "tree",
        museum_id = "MCM",
        data = [];
    
    function show() {
        $("#"+div_id).html('<div class="alert alert-info">' + i18n.translate('download_contents_catalog_online', ' ') + '</div>');
        if (!data.length) {
            celapi.museum.get(museum_id).then(get_contents).then(apply_template);
        } else {
            apply_template();
        }
    }
    
    function hide() {
        document.getElementById(div_id).innerHTML = "";
    }
    
    function get_contents(museum) {
        var calls = [];
        for (var i in museum.collections) {
            var collection = museum.collections[i];
            if (collection.id != "all") {
                // Push collection to "global" data object
                data.push({
                    id: collection.id,
                    name: collection.name
                });
                // Get collection contents and process them
                var filters = {
                    pageSize: 9999
                };
                calls.push(celapi.object.list(museum.acronym, collection.id, filters).then(parse_objects));
            }
        }
        // Wait until all collection contents are fetched and parsed
        return $.when.apply(this, calls);
    }
    
    function parse_objects(list, museum_id, collection_id) {
        // Grab contents and put them in a tree
        var tree = {},
            cultures = {};

        for (var i in list.objects) {
            var object = list.objects[i];
            
            // Create culture record
            var culture_name = object.culture[0] ? object.culture[0] : "(cultura sense especificar - " + collection_id + ")";
            culture_id = slug(culture_name);
            cultures[culture_id] = culture_name;
            if (!tree[culture_id]) {
              tree[culture_id] = [];
            }
            
            // Create object record
            tree[culture_id].push({
                id: object.id,
                name: object.objectName[0] + " [" + object.recordNumber + "]",
                culture: culture_id,
                collection: collection_id
            });
        }
        
        // Restructure cultures & objects in a mustache-friendly way
        var objects = [];
        $.each(tree, function(culture_id, items) {
            objects.push({
                id: culture_id,
                name: cultures[culture_id],
                collection: collection_id,
                items: items
            });
        });
        
        // Attach collection items to the "global" data object
        $.each(data, function(i, el) {
            if (el.id == collection_id) {
                el["items"] = objects;
            }
        });
    }
      
    function apply_template() {
        //console.log(data);
        template.render("mcm.admin.tree", data, div_id).then(add_interactivity);        
    };
    
    function get_item_by_id(id, tree) {
        if(!tree) {
            tree = data;
        }
        for (key in tree) {
            var el = tree[key];
            if(el.id == id) {
                return el;
            } else if(el.items) {
                var found = get_item_by_id(id, el.items);
                if (found) return found;
            }
        };
        return false;
    }
    
    function add_interactivity() {
        $("#tree a").click(function() {
            var id = $(this).parent().attr("id");
            var type = $(this).parent().attr("class");
            var item;
            
            if(type.indexOf(" active") == -1) {               
                $("#tree .active").removeClass("active");
                if (type == "collection") {
                    $("#tree .in").removeClass("in").addClass("collapse");
                } else if (type == "culture") {
                    $("#tree > li > ul > li .in").removeClass("in").addClass("collapse");
                }
                $("#"+id).addClass("active");
                
                //console.log("Clicked on " + id + " " + type);
                bus.publish("mcm.admin.tree.selected", {
                    type: type,
                    item: get_item_by_id(id)
                });               
            }
        });
    };
    
    return {
        show: show,
        hide: hide,
        getData: function() {
            return data;
        },
        getItem: get_item_by_id,
        div: function(div) {
            if (div) {
                div_id = div;
            }
            return div_id;
        }
    };
});
