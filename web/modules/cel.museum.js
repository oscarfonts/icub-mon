define(["messagebus", "cel.api", "template"], function(bus, api, template) {
  
   api.museum.list().then(apply_template).then(add_interactivity);
   
   var museums = [];
   var museum = undefined;
   
   function apply_template(response) {
       for (var i in response) {
           var museum = response[i];
           if (museum.name != "all") {
               museums.push(museum);
           }
       }
       return template.render("cel.museum", museums, "museums");
   }
   
   function add_interactivity() {
        var links = $("#museum-menu > ul > li > a");
       
        links.click(function(e) {
            $("#museum-menu .selected").html(this.innerHTML);
            museum = $(this).data("museum");
            bus.publish("cel.museum.selected", museum);
        });
    }
   
   return {
       get: function() {
           return museum;
       }
   };
    
});
