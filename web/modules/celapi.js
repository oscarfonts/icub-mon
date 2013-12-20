/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['jquery'], function($) {

    var baseURL = "http://celapi.agilogy.net/api/1";
    
    var promises = {}; // This acts as a cache for AJAX responses
    
    setBaseURL = function(url) {
        baseURL = url;
    };
    
    get = function(url, params) {
        var uid = url + (params ? "?" + params.toString() : "");
        if (!promises[uid]) {
            promises[uid] = $.getJSON(url, params);
        }
        return promises[uid];
    };
    
    getMuseums = function() {
        return get(baseURL);
    };
            
    getMuseum = function(id) {
        var id = id ? id : "all";
        return get(baseURL + "/" + id);
    };
    
    getCollection = function(museum_id, collection_id) {
        var museum_id = museum_id ? museum_id : "all";
        var collection_id = collection_id ? collection_id : "all";
        return get(baseURL + "/" + museum_id + "/" + collection_id);
    };
    
    getFieldValues = function(museum_id, collection_id, field) {
        var museum_id = museum_id ? museum_id : "all";
        var collection_id = collection_id ? collection_id : "all";
        return get(baseURL + "/" + museum_id + "/" + collection_id + "/lists", field);
    };
    
    getObjects = function(museum_id, collection_id, filters) {
        var museum_id = museum_id ? museum_id : "all";
        var collection_id = collection_id ? collection_id : "all";
        return get(baseURL + "/" + museum_id + "/" + collection_id + "/objects", filters);
    };
    
    getObject = function(museum_id, collection_id, object_id) {
        var museum_id = museum_id ? museum_id : "all";
        var collection_id = collection_id ? collection_id : "all";
        return get(baseURL + "/" + museum_id + "/" + collection_id + "/objects/" + object_id);
    };

    getComplete = function(museum_id, collection_id, object_id) {
        var museum_id = museum_id ? museum_id : "all";
        var collection_id = collection_id ? collection_id : "all";
        return get(baseURL + "/" + museum_id + "/" + collection_id + "/objects/" + object_id, "complete");
    };
    
    return {
        setBaseURL: setBaseURL,
        getMuseums: getMuseums,
        getMuseum: getMuseum,
        getCollection: getCollection,
        getFieldValues: getFieldValues,
        getObjects: getObjects,
        getObject: getObject,
        getComplete: getComplete
    };
});
