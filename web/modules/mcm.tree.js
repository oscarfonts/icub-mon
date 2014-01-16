define(["celapi", "template"], function(celapi, template) {

    var div_id = "mcm-tree",
        museum_id = "MCM",
        data = [];
    
    function render() {
        $("#"+div_id).html('<div class="alert alert-info">Carregant continguts de ' + museum_id + '...</div>');
        celapi.museum.get(museum_id).then(get_contents).then(apply_template);
    }
    
    function clear() {
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
                calls.push(celapi.object.list(museum.acronym, collection.id).then(parse_objects));
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
                culture: culture_id
            });
        }
        
        // Restructure culture collection in a mustache-friendly way
        var objects = [];
        $.each(tree, function(culture_id, items) {
            objects.push({
                id: culture_id,
                name: cultures[culture_id],
                collection: collection_id,
                items: items
            });
        });
        
        // Add contents to the "global" data object
        $.each(data, function(i, el) {
            if (el.id == collection_id) {
                el["items"] = objects;
            }
        });
    }
      
    function slug(text) {

        text = text.toLowerCase();
          
        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç";
        var to   = "aaaaaeeeeeiiiiooooouuuunc";
        for (var i=0, l=from.length ; i<l ; i++) {
            text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        
        return text.replace(/[^\w ]+/g,'') // remove anything not alphanumeric or spaces
                   .replace(/ +/g,'-');    // replace consecutive spaces with an hyphen
    }
    
    function apply_template() {
        //console.log(data);
        template.render("mcm.tree", data, div_id).then(add_interactivity);        
    };
    
    function add_interactivity() {
        $("#tree a").click(function() {
            var id = $(this).parent().attr("id");
            var type = $(this).parent().attr("class");
            
            if(type.indexOf(" active") == -1) {
                console.log("Clicked on " + id + " " + type);
                
                $("#tree .active").removeClass("active");
                if (type == "collection") {
                    $("#tree .in").removeClass("in").addClass("collapse");
                } else if (type == "culture") {
                    $("#tree > li > ul > li .in").removeClass("in").addClass("collapse");
                }
                $("#"+id).addClass("active");
                
                //bus.publish("mcm.tree.item_selected", {id: id, type: type});               
            }
        });
    };
    
    return {
        render: render,
        clear: clear
    };
});
