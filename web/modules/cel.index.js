define(["messagebus", "cel.museum", "cel.tree", "cel.gallery", "cel.detail"],
        function(bus, museum, tree, gallery, detail) {

    //hideBox("gallery");
    hideBox("detail");
            
    bus.subscribe("cel.museum.selected", function(museum) {
        hideBox("gallery");
        hideBox("detail");
        tree.show(museum);
    });

    // Handle tree element selection
    bus.subscribe("cel.tree.selected", function(selected) {
        showBox("gallery");
        hideBox("detail");

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
    
    bus.subscribe("cel.gallery.selected", function(object) {
        showBox("detail");
        detail.show(object.museum, object.collection, object);
        scrollToBox("detail");
    });
    
    function showBox(id) {
        $("#"+id).closest(".box").show();
    }
    
    function hideBox(id) {
        $("#"+id).closest(".box").hide();
    }
    
    function scrollToBox(id) {
        $('html, body').animate({
            scrollTop: $("#"+id).closest(".box").offset().top - 25
        }, 500);
    }

});
