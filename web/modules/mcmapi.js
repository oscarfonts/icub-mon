/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['http'], function(http) {

    var baseURL = "/api";

    return {
        setBaseURL: function(url) {
            baseURL = url;
        },
        continent: {
            list: function() {
                return http.get(baseURL + "/continents");
            }
        },
        culture: { 
            list: function(continent_id) {
                var params = continent_id ? { continent: continent_id } : "";
                return http.get(baseURL + "/cultures", params);
            },
            get: function(id) {
                return http.get(baseURL + "/cultures/" + id);
            },
            create: function(feature) {
                return http.put(baseURL + "/cultures/", feature);
            },
            update: function(feature) {
                return http.post(baseURL + "/cultures/" + feature.id, feature);
            },
            del: function(id) {
                return http.del(baseURL + "/cultures/" + id);
            }
        },
        object: {
            list: function(culture_id) {
                var params = culture_id ? { culture: culture_id } : "";
                return http.get(baseURL + "/objects", params);
            },
            get: function(id) {
                return http.get(baseURL + "/objects/" + id);
            },
            create: function(feature) {
                return http.put(baseURL + "/objects/", feature);
            },
            update: function(feature) {
                return http.post(baseURL + "/objects/" + feature.id, feature);
            },
            del: function(id) {
                return http.del(baseURL + "/objects/" + id);
            }
        },
        description: {
            list: function() {
                return http.get(baseURL + "/descriptions");
            },
            get: function(id) {
                return http.get(baseURL + "/descriptions/" + id);
            },
            create: function(id, description) {
                return http.put(baseURL + "/descriptions/" + id, description);
            },
            update: function(id, description) {
                return http.post(baseURL + "/descriptions/" + id, description);
            },
            del: function(id) {
                return http.del(baseURL + "/descriptions/" + id);
            }
        }
    };
});
