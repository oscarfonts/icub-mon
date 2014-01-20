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
        "wysihtml5": LIB_PATH + "bootstrap3-wysihtml5",
        "wysihtml5-base": LIB_PATH + "wysihtml5-0.3.0",
        "wysihtml5-ca": LIB_PATH + "bootstrap-wysihtml5.ca-CT",
        "custom": LIB_PATH + "custom",
        "core": LIB_PATH + "core",
        "jquery-migrate": LIB_PATH + "jquery-migrate-1.2.1.min"
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
            deps: ["bootstrap","wysihtml5-base"]
        },
        "wysihtml5-ca": {
            deps: ["wysihtml5"]
        },
        "custom": {
            deps: ["core"]
        },
        "core": {
            deps: ["jquery-migrate"]
        },
        "jquery-migrate": {
            deps: ["jquery"]
        }
    }
});

require(["custom"], function() {
    if (document.getElementsByClassName("lt-ie9").length) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
});
