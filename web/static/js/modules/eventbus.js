define(["jquery"], function($) {
    var bus = {};
    
    return {
        send: function(name, parameters) {
            $(bus).trigger(name, parameters);
        },
        listen: function(name, callBack) {
            $(bus).bind(name, callBack);
        }
    };
});
