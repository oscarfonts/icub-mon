/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "jquery"], function(bus, $) {
    $("#search").submit(function(e) {
        e.preventDefault();
        bus.publish("mcm.search.text", $("#search-text").val());
    });
});
