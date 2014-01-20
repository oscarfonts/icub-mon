define(["messagebus", "login", "mcm.api", "map.editor", "mcm.tree", "mcm.object", "mcm.description.editor"],
    function(bus, login, mcm, mapeditor, tree, object) {

    // Setup login module
    login.linkTo("login", "entrar", "sortir");
    login.onLogin(show);
    login.onLogout(hide);   
    // TODO: Remove this
    login.forceLogin("test", "test");

    // Set tree and object divs
    tree.setDiv("tree");
    object.setDiv("details");

    // Handle tree element selection
    bus.subscribe("mcm.tree.item_selected", function(selected) {
        var type = selected.type;
        var id = selected.item.id;
        
        // Set map editor
        if (type == "collection") { // A continent => no map editor
            mapeditor.hide();
        } else {
            mcm[type].get(id).then(
                function(feature) {
                    mapeditor.load(type, id, feature);
                },
                function(error) {
                    mapeditor.load(type, id);
                }
            );
        }
        
        // Set object details
        if (type == "object") {
            object.show(selected.item.collection, selected.item.id);
        } else {
            object.hide();
        }
    });
    
    bus.subscribe("map.editor.featureCreated", function(data) {
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

    bus.subscribe("map.editor.featureEdited", function(data) {
        mcm[data.type].update(data.feature).then(function(feature) {
            mapeditor.load(data.type, feature.id, feature);
        });
    });

    bus.subscribe("map.editor.featureDeleted", function(data) {
        mcm[data.type].del(data.id).then(function() {
            mapeditor.load(data.type, data.id);
        });
    });
    
    function show(username) {
        tree.show();
    }
    
    function hide(username) {
        tree.hide();
        object.hide();
    }
    
});
