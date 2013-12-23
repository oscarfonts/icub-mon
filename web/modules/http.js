/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['jquery'], function($) {
    
    var cache = {};
    
    var clearFromCache = function(url) {
        $.each(cache, function(key) {
            // Every cached entry starting with the given url...
            if (key.indexOf(url) == 0) {
                // ...is deleted from the cache
                delete cache[key];
            }
        });
    };
    
    var onAjaxSuccess = function(response, status, xhr) {
        return response;
    };
    
    var onAjaxError = function(xhr, status, response) {
        return { error: response, code: xhr.status };
    };
    
    var get = function(url, params) {
        // Attach GET parameters to url identifier
        var p = "";
        if (params) {
            if (typeof params !== "string") {
                p = "?" + $.param(params);
            } else {
                p = "?" + params;
            }
        }
        var url_id = url + p;
        
        // Trigger an AJAX call, or return the cached promise
        if (!cache[url_id]) {
            cache[url_id] = $.ajax({
                url: url,
                data: params
            }).then(onAjaxSuccess, onAjaxError);
        }
        return cache[url_id];
    };
   
    var put = function(url, data) {
        clearFromCache(url);
        return $.ajax({
            type: 'PUT',
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data)
        }).then(onAjaxSuccess, onAjaxError);
    };
    
    var post = function(url, data) {
        clearFromCache(url);
        return $.ajax({
            type: 'POST',
            url: url,
            contentType: "application/json",
            data: JSON.stringify(data)
        }).then(onAjaxSuccess, onAjaxError);
    };
    
    var del = function(url) {
        clearFromCache(url);
        return $.ajax({
            type: 'DELETE',
            url: url
        }).then(onAjaxSuccess, onAjaxError);
    };
    
    return {
        get: get,
        put: put,
        post: post,
        del: del
    };
});
