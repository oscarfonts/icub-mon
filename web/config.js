var LIB_PATH = "../lib/";

require.config({
    paths : {
        "text": LIB_PATH + "text-2.0.10",
        "jquery": LIB_PATH + "jquery-1.10.2",
        "mustache": LIB_PATH + "mustache-0.8.0",
        "bootstrap": LIB_PATH + "bootstrap-3.0.3",
        "leaflet": LIB_PATH + "leaflet-0.6.4",
        "bing": LIB_PATH + "leaflet-bing",
        "draw": LIB_PATH + "leaflet-draw-0.2.3",
        "ie8.html5shiv": LIB_PATH + "html5shiv",
        "ie8.respond": LIB_PATH + "respond.min",
        "wysihtml5": LIB_PATH + "bootstrap3-wysihtml5-0.2.7.min",
        "wysihtml5-ca": LIB_PATH + "bootstrap-wysihtml5.ca-CT",
        "custom": LIB_PATH + "custom",
        "core": LIB_PATH + "core",
        "jquery-migrate": LIB_PATH + "jquery-migrate-1.2.1.min",
        "jquery-maskedinput": LIB_PATH + "jquery-maskedinput-1.3.1"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "bing": {
            deps: ["leaflet"]
        },
        "draw": {
            deps: ["leaflet"]
        },
        "L.Control.DrawSingle": {
            deps: ["draw"]
        },
        "wysihtml5": {
            deps: ["jquery", "bootstrap"]
        },
        "wysihtml5-ca": {
            deps: ["wysihtml5"]
        },
        "custom": {
            deps: ["core"]
        },
        "core": {
            deps: ["jquery-migrate", "bootstrap"]
        },
        "jquery-migrate": {
            deps: ["jquery"]
        },
        "jquery-maskedinput": {
            deps: ["jquery"]
        }
    },
    config: {
        "cel.api": {
            url: "http://celapi.agilogy.net/api/1"
        },
        "mcm.api": {
            url: "http://localhost:5000/api"
        },
        "bootstrap.login": {
            url: "http://localhost:5000/api/login"
        }
    }
});

require(["custom"], function() {
    if (document.getElementsByClassName("lt-ie9").length) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
});
