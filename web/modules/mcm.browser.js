/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "cel.tree", "mcm.map", "mcm.description", "cel.gallery", "cel.detail"],
        function(bus, tree, mcmmap, description, gallery, detail) {
    
    var map = new mcmmap('map');
    map.showContinents();
    
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
        }
        
        gallery.show(museum, collection, field);
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

});
