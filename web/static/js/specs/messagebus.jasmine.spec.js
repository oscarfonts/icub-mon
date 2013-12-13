define(["messagebus"], function(bus) {

    describe("Message Bus", function() {

        describe("Interface", function() {

            it('should let publish messages', function() {
                expect(bus.publish).toBeDefined();
            });

            it('should let start receiving messages', function() {
                expect(bus.subscribe).toBeDefined();
            });

            it('should let stop receiving messages', function() {
                expect(bus.unsubscribe).toBeDefined();
            });

        });

        describe("Behaviour", function() {
            var sent_message = {test: true},
                cb;

            beforeEach(function() {
                // Define a callback function and track it
                cb = {
                    fn: function(received_message) {
                        // Message OK
                        expect(received_message).toBe(sent_message);
                    }
                };
                spyOn(cb, 'fn');

            });

            it('should distribute messages to all subscribers on a channel', function() {
                // Subscribe to a topic
                bus.subscribe("topic", cb.fn);

                // Send a message on a topic
                receivedBy = bus.publish("topic", sent_message);
                expect(receivedBy).toBe(1);       // One subscriptor affected
                expect(cb.fn).toHaveBeenCalled(); // Message received
            });

            it('shouldn\'t distribute messages to subscribers on *other* channels', function() {
                // Subscribe to a topic
                bus.subscribe("topic", cb.fn);

                // Send an off-topic message
                var receivedBy = bus.publish("off-topic", sent_message);
                expect(receivedBy).toBeFalsy();       // No subscriptor affeted
                expect(cb.fn).not.toHaveBeenCalled(); // Message not received
            });

            it('should stop distributing messages to former subscribers that have unsubscribed', function() {
                // Subscribe to a topic
                var subscription_id = bus.subscribe("topic", cb.fn);

                // Send a message
                bus.publish("topic", sent_message);
                expect(cb.fn).toHaveBeenCalled();   // Message received

                // Unsubscribe
                bus.unsubscribe(subscription_id);
                cb.fn.reset(); // Clear spy

                // Send another message
                bus.publish("topic", sent_message);
                expect(cb.fn).not.toHaveBeenCalled(); // Message not received, this time
            });

        });

        describe("Context", function() {

            it('should let a callback run in the context of the subscriber (control the value of *this*)', function() {

                // Define a context and a message
                var custom_context = {context: true};
                var sent_message = {test: true};

                // Create a callback
                var cb = {
                    fn: function(received_message) {
                        // Message OK
                        expect(received_message).toBe(sent_message);
                        // Context OK
                        expect(this).toEqual(custom_context);
                    }
                };
                spyOn(cb, 'fn');

                // Subscribe to a topic with a custom context
                bus.subscribe("topic", cb.fn, custom_context);

                // Send a message
                bus.publish("topic", sent_message);
                expect(cb.fn).toHaveBeenCalled();
            });
        });
    });
});
