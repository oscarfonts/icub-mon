var LIB_PATH = "../lib/";

require.config({
    baseUrl : "../static/js/modules/",
    paths : {
        "jquery": LIB_PATH + "jquery",
        "bootstrap": LIB_PATH + "bootstrap",
        "leaflet": LIB_PATH + "leaflet-src",
        "bing": LIB_PATH + "Bing",
        "draw": LIB_PATH + "leaflet.draw",
        "ie8.html5shiv": LIB_PATH + "html5shiv",
        "ie8.respond": LIB_PATH + "respond.min",
        "wysihtml5": LIB_PATH + "bootstrap3-wysihtml5",
        "wysihtml5-base": LIB_PATH + "wysihtml5-0.3.0",
        "wysihtml5-ca": LIB_PATH + "bootstrap-wysihtml5.ca-CT"
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
        }
    },
    config: {
        "data.contents": {
            api_url: "../api/"
        },
        "data.feature": {
            category: "geometry"
        }
    }
});

require(["tree", "map.editor", "admin.details"], function() {
    if (document.getElementsByClassName("lt-ie9").length) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
});
