var LIB_PATH = "../../../static/js/";

require.config({
    baseUrl : "static/modules",
    paths : {
        "jquery":        LIB_PATH + "jquery",
        "bootstrap":     LIB_PATH + "bootstrap",
        "leaflet":       LIB_PATH + "leaflet-src",
        "bing":          LIB_PATH + "Bing",
        "draw":          LIB_PATH + "leaflet.draw",
        "ie8.html5shiv": LIB_PATH + "html5shiv",
        "ie8.respond":   LIB_PATH + "respond.min"
    }
});

require(["tree", "editor"], function() {
    if (document.getElementsByClassName("lt-ie9").length) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
});
