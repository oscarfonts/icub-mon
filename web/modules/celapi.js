/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['http'], function(http) {

    var baseURL = "http://celapi.agilogy.net/api/1";

    // if param is falsy, then return "all"
    function all(param) {
        return param ? param : "all";
    };
        
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
                    return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/lists", field);
            }
        },
        object: {
            list: function(museum_id, collection_id, filters) {
                return http.get(baseURL + "/" + all(museum_id) + "/" + all(collection_id) + "/objects", filters);
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
