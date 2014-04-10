require.config({
    paths : {
        "text": "../lib/text-2.0.10",
        "jquery": "../lib/jquery-1.10.2",
        "mustache": "../lib/mustache-0.8.0",
        "bootstrap": "../lib/bootstrap-3.0.3",
        "leaflet": "../lib/leaflet-0.6.4",
        "leaflet-label": "../lib/leaflet-label-0.2.2",
        "leaflet-minimap": "../lib/leaflet-minimap",
        "bing": "../lib/leaflet-bing",
        "draw": "../lib/leaflet-draw-0.2.3",
        "ie8.html5shiv": "../lib/html5shiv",
        "ie8.respond": "../lib/respond.min",
        "wysihtml5": "../lib/bootstrap3-wysihtml5-0.2.7.min",
        "wysihtml5-ca": "../lib/bootstrap-wysihtml5.ca-CT",
        "custom": "../lib/custom",
        "core": "../lib/core",
        "jquery-migrate": "../lib/jquery-migrate-1.2.1.min",
        "jquery-maskedinput": "../lib/jquery-maskedinput-1.3.1",
        "jquery-xdomainrequest": "../lib/jquery-xdomainrequest-1.0.1.min",
        "tinycolor": "../lib/tinycolor-0.9.17.min"
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
        "jquery-xdomainrequest": {
            deps: ["jquery"]
        },
        "jquery-migrate": {
            deps: ["jquery"]
        },
        "jquery-maskedinput": {
            deps: ["jquery"]
        },
        "leaflet-label": {
            deps: ["leaflet"]
        },
        "leaflet-minimap": {
            deps: ["leaflet"]
        }
    },
    config: {
        "cel.api": {
            url: "http://vps41774.ovh.net/api/1"
        },
        "mcm.api": {
            url: "http://fonts.cat/mcmapi"
        },
        "bootstrap.login": {
            url: "http://fonts.cat/mcmapi/login"
        }
    }
});

require(["custom"], function() {
    if(document.querySelector(".lt-ie9")) {
        require(["ie8.html5shiv", "ie8.respond"]);
    }
});
