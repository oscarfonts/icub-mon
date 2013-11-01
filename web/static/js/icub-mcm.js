var LIB_PATH = "../lib/";

require.config({
    baseUrl : "static/js/modules/",
    paths : {
        "jquery":        LIB_PATH + "jquery",
        "bootstrap":     LIB_PATH + "bootstrap",
        "leaflet":       LIB_PATH + "leaflet-src",
        "bing":          LIB_PATH + "Bing",
        "ie8.html5shiv": LIB_PATH + "html5shiv",
        "ie8.respond":   LIB_PATH + "respond.min",
        "markercluster": LIB_PATH + "leaflet.markercluster",
        "chap-timeline": LIB_PATH + "timeline"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        },
        "bing": {
            deps: ["leaflet"]
        },
        "markercluster": {
            deps: ["leaflet"]
        }
    },
    config: {
        "data.contents": {
            api_url: "api/"
        },
        "data.feature": {
            category: "feature"
        }
    }
});

require(["data.feature", "map.navigator"], function(features) {
    if (document.getElementsByClassName("lt-ie9").length) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
    
    features.list("cultura");
    
});
