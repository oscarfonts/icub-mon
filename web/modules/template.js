define(["jquery", "mustache"], function($, Mustache) {
    
    return {
        render: function(template_name, data, target_id) {
            var import_tag = "text!../templates/"+template_name+".template.html";
            require([import_tag], function(template) {
                var result = Mustache.render(template, data);
                $("#"+target_id).html(result);
            });

        }
    };
});
