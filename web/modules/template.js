/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */

define(["mustache", "jquery"], function(Mustache, $) {
    
    return {
        render: function(template_name, data, target_id) {
            var defer = $.Deferred();

            var import_tag = "text!../templates/"+template_name+".template.html";
            require([import_tag], function(template) {
                var result = Mustache.render(template, data);
                document.getElementById(target_id).innerHTML = result;
                defer.resolve();
            });

            return defer.promise();
        }
    };
});
