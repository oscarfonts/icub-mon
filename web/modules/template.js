/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */

define(["mustache", "jquery"], function(Mustache, $) {
    
    return {
        render: function(template_name, data, target_id) {
            var defer = $.Deferred();

            var import_tag = "text!../templates/"+template_name+".html";
            require([import_tag], function(template) {
                var result = Mustache.render(template, data);
                document.getElementById(target_id).innerHTML = result;
                defer.resolve();
            });

            return defer.promise();
        },
        
        asKeyValue: function(object) {
            var array = [];
            for (var property in object) {
              if (object.hasOwnProperty(property)){
                array.push({
                  'key' : property,
                  'value' : object[property]
                 });
              }
            }
            return array;
        }
    };
});
