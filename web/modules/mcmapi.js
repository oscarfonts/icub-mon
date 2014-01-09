/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['http'], function(http) {

    var baseURL = "http://localhost:5000/api";

    return {
        setBaseURL: function(url) {
            baseURL = url;
        },
        auth: {
            set: http.auth.set,
            clear: http.auth.clear
        },
        continent: {
            list: function() {
                return http.get(baseURL + "/continent");
            }
        },
        culture: { 
            list: function(continent_id) {
                var params = continent_id ? { continent: continent_id } : "";
                return http.get(baseURL + "/culture", params);
            },
            get: function(id) {
                return http.get(baseURL + "/culture/" + id);
            },
            create: function(feature) {
                return http.post(baseURL + "/culture", feature);
            },
            update: function(feature) {
                return http.put(baseURL + "/culture/" + feature.id, feature);
            },
            del: function(id) {
                return http.del(baseURL + "/culture/" + id);
            }
        },
        object: {
            list: function(culture_id) {
                var params = culture_id ? { culture: culture_id } : "";
                return http.get(baseURL + "/object", params);
            },
            get: function(id) {
                return http.get(baseURL + "/object/" + id);
            },
            create: function(feature) {
                return http.post(baseURL + "/object", feature);
            },
            update: function(feature) {
                return http.put(baseURL + "/object/" + feature.id, feature);
            },
            del: function(id) {
                return http.del(baseURL + "/object/" + id);
            }
        },
        description: {
            list: function() {
                return http.get(baseURL + "/description");
            },
            get: function(id) {
                return http.get(baseURL + "/description/" + id);
            },
            create: function(description) {
                return http.post(baseURL + "/description", description);
            },
            update: function(description) {
                return http.put(baseURL + "/description/" + description.id, description);
            },
            del: function(id) {
                return http.del(baseURL + "/description/" + id);
            }
        }
    };
});
