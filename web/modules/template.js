/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["mcm.i18n", "mustache", "jquery"], function(i18n, Mustache, $) {
    
    return {
        render: function(template_name, data, target_id) {
            var defer = $.Deferred();

            var import_tag = "text!../templates/"+template_name+".html";
            data.translate = function() {
            	return function(text) {
            		return i18n.translate(text);
            	};
            };
            require([import_tag], function(template) {
                var result = Mustache.render(template, data);
                document.getElementById(target_id).innerHTML = result;
                defer.resolve();
            });

            return defer.promise();
        }
    };
});
