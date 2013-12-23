/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(function() {

    var channels = {},
        id_sequence = -1;

    // Publish a message in a channel
    // Returns false if the channel does not exist,
    // or the number of subscribers that received the message 
    function publish(channel, message) {
        if (!channels[channel]) {
            return false;
        }

        var subscribers = channels[channel],
            n = subscribers ? subscribers.length : 0;
        
        for (var i = 0; i < n; i++) {
            var subscription = subscribers[i];
            subscription.callback.apply(subscription.context, [message]);
        }

        return n;
    };

    // Subscribe to a channel.
    // Provide a callback to be run after a message is published.
    // Callback function receives a single param: the "message".
    // Optionally, provide a context for the callback execution (*this*).
    // Returns a subscription id, useful for unsubscription.
    function subscribe(channel, callback, context) {
        if (!channels[channel]) {
            channels[channel] = [];  
        } 

        var id = (++id_sequence).toString();

        channels[channel].push({
            id: id,
            callback: callback,
            context: context
        });

        return id;
    };
    
    // Remove an existing subscription, by id.
    // Returns false if there's no subscription with such id.
    function unsubscribe(id) {
        for (var channel in channels) {
            if (channels[channel]) {
                
                var subscribers = channels[channel],
                    n = subscribers ? subscribers.length : 0;
                
                for (var i = 0; i < n; i++) {
                    if (subscribers[i].id === id) {
                        subscribers.splice(i, 1);
                        return id;
                    }
                }
            }
        }
        
        return false;
    };

    return {
        publish: publish,
        subscribe: subscribe,
        unsubscribe: unsubscribe
    };
});
