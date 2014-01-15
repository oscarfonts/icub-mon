define(["login", "mcm.tree"/*, "leaflet.feature.editor", "mcm.object.details", "mcm.description.editor"*/], function(login, tree) {

    login.linkTo("login", "entrar", "sortir");
    login.onLogin(render);
    login.onLogout(clear);
    
    // TODO: Remove this
    login.forceLogin("test", "test");
    
    function render(username) {
        tree.render();
    }
    
    function clear(username) {
        tree.clear();
    }
});
