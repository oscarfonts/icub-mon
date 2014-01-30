/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["http", "module"], function(http, module) {

    var baseURL = module.config().url ? module.config().url : "http://celapi.agilogy.net/api/1";

    // if param is falsy, then return "all"
    function all(param) {
        return param ? param : "all";
    };
    
    // Push input arguments into callback arguments
    function deferWithArgs(data, args) {
        var new_args = Array.prototype.slice.call(args);
        new_args.unshift(data);
        d = $.Deferred();
        d.resolveWith(this, new_args);
        return d;
    }
        
    return {
        url: function(url) {
            if (url) {
                baseURL = url;
            }
            return baseURL;
        },
        museum: {
            list: function() {
                return http.get(baseURL);
            },
            get: function(id) {
                return http.get(baseURL + "/" + all(id));                
            }
        },
        collection: {
            get: function(museum_id, collection_id) {
                var args = arguments;
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id))
                    .then(function(data) {
                        return deferWithArgs(data, args);
                    });
            },
            fields: function(museum_id, collection_id, field) {
                var args = arguments;
                var param = field ? { name: field } : undefined;
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/lists", field)
                    .then(function(data) {
                        return deferWithArgs(data, args);
                    });
            }
        },
        object: {
            list: function(museum_id, collection_id, filters) {
                var args = arguments;
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/objects", filters)
                    .then(function(data) {
                        return deferWithArgs(data, args);
                    });
            },
            get: function(museum_id, collection_id, object_id) {
                var args = arguments;
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/objects/" + object_id)
                    .then(function(data) {
                        return deferWithArgs(data, args);
                    });
            },
            details: function(museum_id, collection_id, object_id) {
                var args = arguments;
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/objects/" + object_id, "complete")
                    .then(function(data) {
                        return deferWithArgs(data, args);
                    });
            }
        }
    };
});
