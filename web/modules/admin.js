define(["login"/*, "mcm.tree", "leaflet.feature.editor", "mcm.object.details", "mcm.description.editor"*/], function(login) {

    login.linkTo("login", "entrar", "sortir");
    login.onLogin(render);
    login.onLogout(clear);
    
    function render(username) {
        alert("Welcome " + username);
    }
    
    function clear(username) {
        alert("Goodbye " + username);
    }
});
