define(["http", "template", "jquery", "bootstrap"], function(http, template, $) {
    
    var url = "http://127.0.0.1:5000/login"; // TODO: Parametrize login URL
    var logged_in = false;
    var link = undefined;
    var callbacks = {
        login: function() {},
        logout: function() {}
    };
    
    function login() {
        var username = $("#username").val();
        var password = $("#password").val();
        authenticate(username, password);
    }
    
    function authenticate(username, password) {
        http.auth.set(username, password);
        http.get(url).then(ok, ko);
    }

    function ok(message) {
        logged_in = message.login;
        $("#login_dialog").modal('hide');
        update_link();
        callbacks.login(logged_in);
    }

    function ko(error) {
        if (error.code && error.code == 401) {
            message = "Accés denegat. Usuari o password incorrectes.";
        } else {
            message = "S'ha produït un error en comprovar l'usuari.<br/>Contacteu amb l'administrador.";
        }
        $("#login_error").html('<div class="alert alert-danger">'+message+'</div>');
        http.auth.clear();
    }

    function logout() {
        http.auth.clear();
        callbacks.logout(logged_in);
        logged_in = false;
        update_link();
    }
    
    function clear() {
        $("#login_error").html('');
        $("#username").val('');
        $("#password").val('');        
    }
    
    function update_link() {
        if (link) {
            var text = logged_in ? link.logout_text : link.login_text;
            $("#"+link.id).html(text);
        }
    }
    
    // Add bootstrap dialog
    $("<div/>").attr("id", "login_dialog_container").appendTo("body");
    template.render("login", {}, "login_dialog_container").then(function() {
        $("#login_dialog").modal();
        $('#login_dialog').on('hidden.bs.modal', clear);
        $("#login_button").click(login);        
    });

    return {
        linkTo: function(id, login_text, logout_text) {
            link = {
                id: id,
                login_text: login_text,
                logout_text: logout_text
            };
            
            // Login/logout link behaviour
            $("#"+link.id).click(function() {
                if (logged_in) {
                    logout();
                } else {
                    $("#login_dialog").modal('show');
                }
            });
            update_link();
        },
        onLogin: function(callback) {
            callbacks.login = callback;
        },
        onLogout: function(callback) {
            callbacks.logout = callback;
        }
    };
});
