define(["messagebus", "template", "cel.field", "cel.api"], function(bus, template, fields, api) {
    
    var page = 1;
   
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
        
        return get_objects(criteria).then(add_interactivity);
    }

    function show_criteria(criteria) {
        template.render("cel.gallery-criteria", criteria, "gallery-criteria");
    }
    
    function get_objects(criteria) {
        
        function show_objects(list) {
            // The data structure to be sent to the gallery-objects template
            var data = {};

            // Add pagination control
            if (list.page.total / list.page.size > 1) {
                data.paging = {
                    prev: list.page.number > 1,
                    next: list.page.number < Math.ceil(list.page.total/list.page.size),
                    from: ((list.page.number - 1) * list.page.size) +1,
                    to: Math.min(list.page.number * list.page.size, list.page.total),
                    total: list.page.total,
                    criteria: JSON.stringify(criteria)
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
            
            return template.render("cel.gallery-objects", data, "gallery-objects");
        }
        
        var filters = {
            //search: undefined,
            //dateFrom: undefined,
            //dateTo: undefined,
            pageNumber: criteria.page,
            pageSize: 12
        };

        if (criteria.field) {
            filters[criteria.field.name] = criteria.field.value;
        }

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
        var criteria = $("#gallery-objects .pager").data("criteria");
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
            var object = $(this).data("object"); // TODO
            bus.publish("cel.gallery.selected", object);
        });
    }
    
    return {
        show: show
    };
});
