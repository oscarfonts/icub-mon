define(["messagebus"], function(bus) {

    describe("Message Bus", function() {

        describe("Interface", function() {

            it('should let publish messages', function() {
                expect(bus).to.respondTo('publish');
            });

            it('should let subscribers receive messages', function() {
                expect(bus).to.respondTo('subscribe');
            });

            it('should let subscribers stop receiving messages', function() {
                expect(bus).to.respondTo('unsubscribe');
            });

        });

        describe("Behavior", function() {
            it('subscribers should receive messages over the subscribed channel',
            function(done) {
                var topic_message = {test: true};
                var offtopic_message = {test: false};

                // Subscribe to a topic
                bus.subscribe("topic", function(received_message) {
                    expect(received_message).to.equal(topic_message);
                    done();
                });

                // Send an off-topic message
                var receivedBy = bus.publish("off-topic", offtopic_message);
                expect(receivedBy).to.equal(false);

                // Send a topic message
                receivedBy = bus.publish("topic", topic_message);
                expect(receivedBy).to.equal(1);
            });

        });
    });
});
