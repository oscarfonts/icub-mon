/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "bootstrap.login", "bootstrap.editor", "leaflet.editor", "mcm.api", "mcm.tree", "cel.detail"],
    function(bus, login, htmleditor, mapeditor, mcm, tree, detail) {

    // Setup login module
    login.linkTo("login", "entrar", "sortir");
    login.onLogin(on_login);
    login.onLogout(on_logout);   
    
    login.forceLogin("test", "test"); // TODO: Remove this in production
    
    // Create html editors
    var editors = {};
    var langs = ["ca", "es", "en"];
    for (var i in langs) {
        var lang = langs[i];
        editors[lang] = new htmleditor("description-"+lang, saveDescription);
    }

    // Handle tree element selection
    bus.subscribe("mcm.tree.selected", function(selected) {
        var type = selected.type;
        var id = selected.item.id;
        
        // Set map editor
        if (type == "collection") { // A continent
            hideBox("map");
            mapeditor.hide();
        } else {
            showBox("map");
            mapeditor.redraw();
            mcm[type].get(id).then(
                function(feature) {
                    mapeditor.load(type, id, feature);
                },
                function(error) {
                    mapeditor.load(type, id);
                }
            );
        }

        if (type == "culture") {
            for (var lang in editors) {
                showBox("description-"+lang);
                mcm.description.get(id, lang).then(
                    function(description, lang) {
                        description.lang = lang;
                        editors[lang].load(description);
                    },
                    function(error, lang) {
                        editors[lang].load({
                            create: true,
                            id: id,
                            html: "",
                            lang: lang
                        });
                    }
                );
            }
        } else {
            for (var lang in editors) {
                hideBox("description-"+lang);
                editors[lang].hide();
            }
        }
        
        if (type == "object") {
            showBox("detail");
            detail.show("MCM", selected.item.collection, id);
        } else {
            hideBox("detail");
            detail.hide();
        }
    });
    
    bus.subscribe("leaflet.editor.featureCreated", function(data) {
        // Add alphanumeric feature properties
        var item = tree.getItem(data.feature.id);
        if (item.hasOwnProperty("culture")) {
            data.feature.properties["culture"] = item.culture;
        } else {
            data.feature.properties["continent"] = item.collection;
        }
        
        mcm[data.type].create(data.feature).then(function(feature) {
            mapeditor.load(data.type, feature.id, feature);
        });
    });

    bus.subscribe("leaflet.editor.featureEdited", function(data) {
        mcm[data.type].update(data.feature).then(function(feature) {
            mapeditor.load(data.type, feature.id, feature);
        });
    });

    bus.subscribe("leaflet.editor.featureDeleted", function(data) {
        mcm[data.type].del(data.id).then(function() {
            mapeditor.load(data.type, data.id);
        });
    });

    function saveDescription(data) {
        var description = {
            id: data.id,
            html: data.html
        };
        
        if (data.create) {
            mcm.description.create(description, data.lang); // TODO notify via .then(); 
        } else {
            mcm.description.update(description, data.lang); // TODO notify via .then();
        }
    };
    
    function on_login(username) {
        tree.show();
    }
    
    function on_logout(username) {
        tree.hide();
        hideBox("map");
        mapeditor.hide();
        hideBox("detail");
        detail.hide();
        for (var lang in editors) {
            hideBox("description-"+lang);
            editors[lang].hide();
        }
    }
    
    function showBox(id) {
        $("#"+id).closest(".box").show();
    }
    
    function hideBox(id) {
        $("#"+id).closest(".box").hide();
    }
    
});
