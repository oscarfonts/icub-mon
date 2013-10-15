require.config({
    baseUrl : "static/modules",
    paths : {
        "leaflet": "../lib/leaflet-src",
        "jquery": "../lib/jquery"
    }
});

require(["tree", "map"]);
