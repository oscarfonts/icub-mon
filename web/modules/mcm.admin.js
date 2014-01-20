define(["messagebus", "login", "mcm.tree", "mcm.object", "mcm.description.editor", "map.editor"], function(bus, login, tree, object) {

    login.linkTo("login", "entrar", "sortir");
    tree.setDiv("tree");
    object.setDiv("details");

    login.onLogin(show);
    login.onLogout(hide);   
    
    // TODO: Remove this
    login.forceLogin("test", "test");

    bus.subscribe("mcm.tree.item_selected", function(selected) {
        if (selected.type == "object") {
            object.show(selected.item.collection, selected.item.id);
        } else {
            object.hide();
        }
    });
    
    function show(username) {
        tree.show();
    }
    
    function hide(username) {
        tree.hide();
        object.hide();
    }
    
});
