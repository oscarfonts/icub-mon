/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['http'], function(http) {

    var baseURL = "http://celapi.agilogy.net/api/1"; // TODO: Parametrize CELAPI URL

    // if param is falsy, then return "all"
    function all(param) {
        return param ? param : "all";
    };
    
    // Push input arguments into callback arguments
    function deferWith(data, args) {
        var new_args = Array.prototype.slice.call(args);
        new_args.unshift(data);
        d = $.Deferred();
        d.resolveWith(this, new_args);
        return d;
    }
        
    return {
        setBaseURL: function(url) {
            baseURL = url;
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
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id));
            },
            fields: function(museum_id, collection_id, field) {
                var args = arguments;
                var param = field ? { name: field } : undefined;
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/lists", field)
                    .then(function(data) {
                        return deferWith(data, args);
                    });
            }
        },
        object: {
            list: function(museum_id, collection_id, filters) {
                var args = arguments;
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/objects", filters)
                    .then(function(data) {
                        return deferWith(data, args);
                    });
            },
            get: function(museum_id, collection_id, object_id) {
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/objects/" + object_id);
            },
            details: function(museum_id, collection_id, object_id) {
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/objects/" + object_id, "complete");
            }
        }
    };
});
