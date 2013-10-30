var JS_PATH = "../../../static/js/";
var LIB_PATH = JS_PATH + "lib/";

require.config({
    baseUrl : JS_PATH + "modules/",
    paths : {
        "jquery":        LIB_PATH + "jquery",
        "bootstrap":     LIB_PATH + "bootstrap",
        "leaflet":       LIB_PATH + "leaflet-src",
        "bing":          LIB_PATH + "Bing",
        "draw":          LIB_PATH + "leaflet.draw",
        "ie8.html5shiv": LIB_PATH + "html5shiv",
        "ie8.respond":   LIB_PATH + "respond.min"
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
        }
    }
});

require(["tree", "map.editor", "description"], function() {
    if (document.getElementsByClassName("lt-ie9").length) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
});
