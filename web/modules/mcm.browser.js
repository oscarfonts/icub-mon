/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["mcm.i18n", "messagebus", "cel.tree", "mcm.search", "mcm.map", "mcm.description", "mcm.gallery", "cel.detail", "slug"],
        function(i18n, bus, tree, search, mcmmap, description, gallery, detail, slug) {
    
    var map = new mcmmap('map');
    var advanced = false;
    map.showContinents();
    
    i18n.init().done(function(a) {
    	$('.show-advanced-search').text(i18n.translate('advanced_search', '>'));
    	$('#search-text').attr('placeholder', i18n.translate('search'));
    });

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
        gallery.show(museum, collection, field, filters, "Resultats de la cerca");
    });

    bus.subscribe("mcm.search.advanced", function(filters) {
        hideBox("map");
        showBox("gallery");

        var field;
        var collectionId = filters.collectionId || "all";
        delete filters.collectionId;
        gallery.show(museum, {id: collectionId}, field, filters, "Resultats de la cerca");
    });

    bus.subscribe("mcm.search.toggle", function(shown) {
        hideBox("gallery");
        var link = $(".show-advanced-search");
        if (shown) {
            link.html(i18n.translate('advanced_search', '<'));
            $("#simple-search").hide();
            $("#tree").hide();
            hideBox("map");
        } else {
            link.html(i18n.translate('advanced_search', '>'));
            $("#simple-search").show();
            $("#tree").show();
            showBox("map");
        }
        advanced = shown;
    });

    bus.subscribe("cel.detail.toggle", function(shown) {
        if (shown) {
            hideBox("gallery");
            hideBox("map");
            $("#tree").hide();
            $("#simple-search-container").hide();
            showBox("detail");
            scrollToBox("detail");
        } else {
            hideBox("detail");
            $("#simple-search-container").show();
            if (!advanced) {
                $("#tree").show();
                showBox("map");
            }
            showBox("gallery");
            scrollToBox("gallery");
        }
    });

    function showBox(id) {
        $("#"+id).closest(".box").show();
        if (id == "map") {
            map.redraw();
        }
    }
    
    function hideBox(id) {
        $("#"+id).closest(".box").hide();
    }
    
    function scrollToBox(id) {
        $('html, body').animate({
            scrollTop: $("#"+id).closest(".box").offset().top - 25
        }, 0);
    }

});
