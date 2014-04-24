/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "cel.tree", "mcm.search", "mcm.map", "mcm.description", "mcm.gallery", "cel.detail", "slug"],
        function(bus, tree, search, mcmmap, description, gallery, detail, slug) {
    
    var map = new mcmmap('map');
    map.showContinents();

    var museum = {
        acronym: "MCM",
        name: "Museu Cultures del Món"
    };

    tree.setField("culture");
    tree.template("mcm.tree");
    tree.show(museum);

    // Handle tree element selection
    bus.subscribe("cel.tree.selected", function(selected) {
        showBox("map");
        hideBox("description");
        showBox("gallery");
        hideBox("detail");

        var value = selected.value;
        var museum = value.museum;
        var collection = {};
        var field = undefined;
        
        if (selected.type == "collection") { // Continent
            collection.id = value.id;
            collection.name = value.name;
            description.hide();
            map.showCultures(collection.id);
            hideBox("gallery");
            //$(".subtitle").html("- " + collection.name);
        } else { // Culture           
            collection = value.collection;
            field = {
                name: value.name,
                value: value.value,
                slug: slug(value.value)
            };
            description.show(field.slug, "ca").then(function() {
                // Only show if resource exists
                showBox("description");            
            });
            map.showCulture(field.slug);
            gallery.show(museum, collection, field);
            //$(".subtitle").html("- " + field.value);
        }
    });
    
    bus.subscribe("mcm.map.selected", function(item) {
        console.log("Selected map item " + JSON.stringify(item));
        tree.selectItem(item);
    });

    bus.subscribe("mcm.map.hovered", function(item) {
        console.log("Hovered map item " + JSON.stringify(item));
    });
    
    bus.subscribe("mcm.map.unhovered", function(item) {
        console.log("Unhovered map item " + JSON.stringify(item));
    });
    
    bus.subscribe("cel.gallery.selected", function(object) {
        showBox("detail");
        detail.show(object.museum.acronym, object.collection.id, object.id);
        scrollToBox("detail");
    });
    
    // Simple & advanced search forms
    search.show();
    $(".show-advanced-search").click(search.toggle);

    bus.subscribe("mcm.search.text", function(text) {
        hideBox("map");
        showBox("gallery");

        var collection = {id: "all"};
        var field;
        var filters = { search: text };
        gallery.show(museum, collection, field, filters);
    });

    bus.subscribe("mcm.search.advanced", function(filters) {
        hideBox("map");
        showBox("gallery");

        var field;
        var collectionId = filters.collectionId || "all";
        delete filters.collectionId;
        gallery.show(museum, {id: collectionId}, field, filters);
    });

    bus.subscribe("mcm.search.toggle", function(shown) {
        hideBox("gallery");
        // TODO: Reset map status
        var link = $(".show-advanced-search");
        if (shown) {
            link.html("Cerca avançada <");
            $("#simple-search").hide();
            $("#tree").hide();
            hideBox("map");
        } else {
            link.html("Cerca avançada >");
            $("#simple-search").show();
            $("#tree").show();
            showBox("map");
        }
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
