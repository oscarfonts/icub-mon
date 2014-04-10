/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "cel.tree", "mcm.map", "mcm.description", "cel.gallery", "cel.detail", "slug", "mcm.i18n"],
        function(bus, tree, mcmmap, description, gallery, detail, slug, i18n) {
    
    var map = new mcmmap('map');
    map.showContinents();
    
    i18n.init();
    
    tree.setField("culture");
    tree.template("mcm.tree");
    gallery.templates("mcm.gallery-criteria");
    tree.show({
        acronym: "MCM",
        name: "Museu Cultures del Món"
    });

    // Handle tree element selection
    bus.subscribe("cel.tree.selected", function(selected) {
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
            //$(".subtitle").html("- " + field.value);
        }
        
        gallery.show(museum, collection, field);
    });
    
    bus.subscribe("mcm.map.selected", function(item) {
        console.log("Selected map item " + JSON.stringify(item));
        tree.selectItem(item); // Superfluo cuando clico en una cultura y ya estoy en la cultura (!).
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
