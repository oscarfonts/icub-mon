/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["messagebus", "template", "cel.field", "cel.api", "jquery", "jquery-maskedinput"], function(bus, template, fields, api, $) {
    
    var templates = {
        objects: "cel.gallery-objects"
    };
   
    function show(museum, collection, field, filters) {
        if(field) {
            field.title = fields.getFieldName(field.name);
        }
        var criteria = {
            museum: museum,
            collection: collection,
            field: field,
            filters: filters,
            page: 1
        };

        get_objects(criteria);
    }
    
    function get_objects(criteria) {
        
        function show_objects(list) {
            // The data structure to be sent to the gallery-objects template
            var count = 0;
            var data = {};
            
            data["row"] = function() {
                return !(++count % 4);
            };

            data.criteria = criteria;
            data.criteria_json = JSON.stringify(criteria);

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
                plain.img = object.relatedMedia || false;
                plain.museum = criteria.museum;
                plain.collection = {id: object._links.self.href.split("/").reverse()[2]}; // TODO, CELAPI should provide an easier way to get an object's collection
                plain.json = JSON.stringify(plain);
                data.objects.push(plain);
            }
                       
            return template.render(templates.objects, data, "gallery-objects").then(add_interactivity);
        }
        
        var filters = {
            sort: "date+ASC",
            pageNumber: criteria.page,
            pageSize: 12
        };
        
        if (criteria.field) {
            filters[criteria.field.name] = criteria.field.value;
        }

        for (var k in criteria.filters) {
            if (criteria.filters[k]) {
                filters[k] = criteria.filters[k];
            }
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
                get_objects(criteria);
            });
            
            next.click(function(e) {
                criteria.page = criteria.page + 1;
                get_objects(criteria);
            });
        }
        
        // Object selection
        $(".gallery .item").click(function(e) {
            var object = $(this).data("object");
            bus.publish("cel.gallery.selected", object);
        });
    }
    
    return {
        show: show
    };
});
