/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["module", "http"], function(module, http) {

    var baseURL = module.config().url ? module.config().url : "http://fonts.cat/icub/api";
    var default_lang = "ca";

    return {
        url: function(url) {
            if (url) {
                baseURL = url;
            }
            return baseURL;
        },
        auth: {
            set: http.auth.set,
            clear: http.auth.clear
        },
        lang: {
            set: function(lang) {
                default_lang = lang;
            }
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
            list: function(lang) {
                var l = lang ? lang : default_lang;
                return http.get(baseURL + "/description_" + l);
            },
            get: function(id, lang) {
                var l = lang ? lang : default_lang;
                return http.get(baseURL + "/description_" + l + "/" + id).then(
                    function(description) {
                        d = $.Deferred();
                        d.resolveWith(this, [description, lang]);
                        return d;
                    },
                    function(error) {
                        d = $.Deferred();
                        d.rejectWith(this, [error, lang]);
                        return d;
                    }
                );
            },
            create: function(description, lang) {
                var l = lang ? lang : default_lang;
                return http.post(baseURL + "/description_" + l, description);
            },
            update: function(description, lang) {
                var l = lang ? lang : default_lang;
                return http.put(baseURL + "/description_" + l + "/" + description.id, description);
            },
            del: function(id, lang) {
                var l = lang ? lang : default_lang;
                return http.del(baseURL + "/description_" + l + "/" + id);
            }
        }
    };
});
