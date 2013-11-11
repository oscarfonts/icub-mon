define(["jquery"], function($) {
    var bus = {};
    
    return {
        send: function(name, parameters) {
            $(bus).trigger(name, parameters);
        },
        listen: function(name, callback, scope) {
            $(bus).bind(name, function(event, data) {
                callback.call(scope, event, data);
            });
        }
    };
});
