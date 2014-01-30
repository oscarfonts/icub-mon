/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "template", "cel.field", "cel.api", "jquery", "jquery-maskedinput"], function(bus, template, fields, api, $) {
    
    $("#dateFrom").mask("9999");
    $("#dateTo").mask("9999");
    $("#search-enabled").change(function() {
        $("#search").prop("disabled", !this.checked);
        $("#refine-action").show();
    });
    $("#daterange-enabled").change(function() {
        $("#dateFrom").prop("disabled", !this.checked);
        $("#dateTo").prop("disabled", !this.checked);
        $("#refine-action").show();
    });
    $("#search").keyup(function(){
        $("#refine-action").show();
    });
    $("#dateFrom").keyup(function(){
        $("#refine-action").show();
    });
    $("#dateTo").keyup(function(){
        $("#refine-action").show();
    });
    $("#refine-action").click(function() {
        var criteria = $("#gallery-criteria-data").data("criteria");
        if (criteria) {
            show(criteria.museum, criteria.collection, criteria.field);
            $("#refine-action").hide();
        }
    });
   
    function show(museum, collection, field) {
        if(field) {
            field.title = fields.getFieldName(field.name);
        }
        var criteria = {
            museum: museum,
            collection: collection,
            field: field,
            page: 1
        };
        
        show_criteria(criteria);
        get_objects(criteria);
    }

    function show_criteria(criteria) {
        template.render("cel.gallery-criteria", criteria, "gallery-criteria");
    }
    
    function get_objects(criteria) {
        
        function show_objects(list) {
            // The data structure to be sent to the gallery-objects template
            var data = {};

            data.criteria = JSON.stringify(criteria);

            // Add pagination control
            if (list.page.total / list.page.size > 1) {
                data.paging = {
                    prev: list.page.number > 1,
                    next: list.page.number < Math.ceil(list.page.total/list.page.size),
                    from: ((list.page.number - 1) * list.page.size) +1,
                    to: Math.min(list.page.number * list.page.size, list.page.total),
                    total: list.page.total,
                };
            }

            // Parse the object list
            data.objects = [];
            for (var i in list.objects) {
                var object = list.objects[i];
                var plain = {};
                
                plain.author = all("value", object.author).join("; ");
                plain.creationDate = object.creationDate ? object.creationDate.display : "";
                plain.culture = object.culture.join("; ");
                plain.executionPlace = all("value", object.executionPlace).join("; ");
                plain.id = object.id;
                plain.material = all("valueMaterial", object.materialTechnique).join("; ");
                plain.technique = all("valueTechnique", object.materialTechnique).join("; ");
                plain.objectName = object.objectName.join("; ");
                plain.provenance = all("value", object.provenance).join("; ");
                plain.recordNumber = object.recordNumber.join("; ");
                plain.img = object.id.substr(1);
                plain.museum = criteria.museum;
                plain.collection = criteria.collection;
                plain.json = JSON.stringify(plain);
                data.objects.push(plain);
            }
                       
            return template.render("cel.gallery-objects", data, "gallery-objects").then(add_interactivity);
        }
        
        var filters = {
            pageNumber: criteria.page,
            pageSize: 12
        };
        
        if ($("#search:enabled").length && $("#search").val()) {
            filters.search = $("#search").val();
        }
        
        if ($("#dateFrom:enabled").length && $("#dateFrom").val().length) {
            filters.dateFrom = $("#dateFrom").val();
        }
        
        if ($("#dateTo:enabled").length && $("#dateTo").val().length) {
            filters.dateTo = $("#dateTo").val();
        }

        if (criteria.field) {
            filters[criteria.field.name] = criteria.field.value;
        }
        
        document.getElementById("gallery-objects").innerHTML = '<div class="alert alert-info">Cercant peces a les col·leccions en línia...</div>';
        
        return api.object.list(criteria.museum.acronym, criteria.collection.id, filters).then(show_objects);
    }
    
    function all(prop, arr) {
        var ret = [];
        if (arr && arr instanceof Array) {
            for (var i in arr) {
                var el = arr[i];
                if (el[prop]) {
                    if (el[prop] instanceof Array) {
                        ret.join(el[prop]);
                    } else {
                        ret.push(el[prop]);
                    }
                }
            }
        }   
        return ret;
    }
    
    function add_interactivity() {
        
        // Paging
        var criteria = $("#gallery-criteria-data").data("criteria");
        if (criteria) {
            var previous = $("#gallery-objects .previous:not(.disabled)");
            var next = $("#gallery-objects .next:not(.disabled)");
            
            previous.click(function(e) {
                criteria.page = criteria.page - 1;
                get_objects(criteria).then(add_interactivity);
            });
            
            next.click(function(e) {
                criteria.page = criteria.page + 1;
                get_objects(criteria).then(add_interactivity);
            });
        }
        
        // Items
        var panels = $("#gallery-objects .panel");
        
        var maxHeight = Math.max.apply(
            Math, panels.map(function() {
                return $(this).height();
            }).get());
        
        panels.height(maxHeight);
        
        panels.hover(function(e) {
            $(this).removeClass("panel-info").addClass("panel-primary");
        }, function(e) {
            $(this).removeClass("panel-primary").addClass("panel-info");
        });
        
        panels.click(function(e) {
            var object = $(this).data("object");
            bus.publish("cel.gallery.selected", object);
        });
    }
    
    return {
        show: show
    };
});
