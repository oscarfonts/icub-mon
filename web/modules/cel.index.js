define(["messagebus", "cel.museum", "cel.tree", "cel.gallery", "mcm.object"],
        function(bus, museum, tree, gallery, object) {

    object.setDiv("piece");
    
    bus.subscribe("cel.museum.selected", function(museum) {
        hideBox("gallery");
        hideBox("piece");
        tree.show(museum);
    });

    // Handle tree element selection
    bus.subscribe("cel.tree.selected", function(selected) {
        showBox("gallery");
        hideBox("piece");

        var value = selected.value;
        var museum = value.museum;
        var collection = {};
        var field = undefined;
        
        if (selected.type == "collection") {
            collection.id = value.id;
            collection.name = value.name;
        } else {
            collection = value.collection;
            field = {
                name: value.name,
                value: value.value
            };
        }
        
        gallery.show(museum, collection, field);
    });
        
    function showBox(id) {
        $("#"+id).closest(".box").show();
    }
    
    function hideBox(id) {
        $("#"+id).closest(".box").hide();
    }

});
