define(["cel.api", "jquery"], function(api, $) {
    
    var filters = {
            pageSize: 10
        };

    function setSearchFilter(text) {
        filters.text = text;
    }
    
    function setDateFromFilter(date) {
        filters.dateFrom = date;
    }
    
    function setDateToFilter(date) {
        filters.dateTo = date;
    }

    function getMuseumContents(museum, field) {
        var collections = {};
        var calls = [];
               
        function getFieldValues(museum) {
            for (var i in museum.collections) {
                var collection = museum.collections[i];
                delete collection._links;
                delete collection.items;
                collection.museum = {acronym: museum.acronym, name: museum.name};
                collection.json = function() {
                    return JSON.stringify({
                        museum: this.museum,
                        id: this.id,
                        name: this.name
                    });
                };
                
                if (collection.id != "all") {
                    collections[collection.id] = collection;
                    if (field && field.id && field.id != "none") {
                        calls.push(api.collection.fields(museum.acronym, collection.id, {name: field.id}).then(addFieldValues));
                    } else {
                        calls.push($.Deferred().resolve());
                    }
                }                
            }
            return $.when.apply(this, calls).then(collectionsAsArray);
        }
        
        function collectionsAsArray() {
            var data = [];
            for(var key in collections) {
                data.push(collections[key]);
            }
            console.log(data);
            return data;
        }
        
        function addFieldValues(fields, museum_id, collection_id) {
            if (fields.length == 0) {
                return;
            }
            var field = fields[0];
            var collection = collections[collection_id];
            for(var i in field.values) {
                var value = field.values[i];
                value.museum = museum;
                value.collection = {id: collection.id, name: collection.name, museum: collection.museum};
                value.name = field.name;
                value.json = function() {
                    var x = {
                        museum: {id: this.museum.id, acronym: this.museum.acronym},
                        collection: {id: this.collection.id, name: this.collection.name},
                        name: this.name,
                        value: this.value
                    };
                    return JSON.stringify(x);
                };
            }
            collection.fields = field.values;
        }

        return $.Deferred().resolve(museum).then(getFieldValues);
    }
    
    return {
        getMuseumContents: getMuseumContents,
        setFilter: {
            search: setSearchFilter,
            dateFrom: setDateFromFilter,
            dateTo: setDateToFilter,
        }
    };

});
