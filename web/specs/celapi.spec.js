/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */

// See API specification at http://docs.celapi.apiary.io/
define(["celapi"], function(celapi) {
    
    var async = new AsyncSpec(this);
    
    describe("Celapi API", function() {
        
        describe("Museums", function() {
            
            var checkMuseums = function(museums) {
                expect(museums).toBeDefined();
                expect(museums instanceof Array).toBeTruthy();
                expect(museums.length).toBeGreaterThan(0);
                $.each(museums, function(index, museum) {
                    checkMuseum(museum);
                });
            };

            var checkMuseum = function(museum) {
                expect(museum.name).toBeDefined();
                expect(museum.acronym).toBeDefined();
                expect(museum.collections instanceof Array).toBeTruthy();
                expect(museum._links).toBeDefined();
            };
            
            var checkAllMuseum = function(museum) {
                expect(museum).toBeDefined();
                expect(museum.name).toEqual("all");
                expect(museum.acronym).toEqual("all");
                expect(museum.collections instanceof Array).toBeTruthy();
                expect(museum._links).toBeDefined();
            };
                       
            var selectMuseumById = function(museums) {
                var id = museums.pop().acronym;
                return celapi.getMuseum(id);
            };

            async.it("should list all Museums", function(done) {
                celapi.getMuseums().then(checkMuseums).then(done, done, done);
            });

            async.it("should retrieve a Museum by ID", function(done) {
                celapi.getMuseums().then(selectMuseumById).then(checkMuseum).then(done, done, done);
            });

            async.it("should retrieve the ALL virtual Museum", function(done) {
                celapi.getMuseum().then(checkAllMuseum).then(done, done, done);
            });            
            
        });
        
        describe("Collections", function() {
            
            var museum_id = "MCM";

            var checkCollections = function(museum) {
                $.each(museum.collections, function(i, collection) {
                    celapi.getCollection(museum.acronym, collection.name).then(checkCollection);
                });
            };
    
            var checkCollection = function(collection) {
                expect(collection.name).toBeDefined();
                expect(collection._links).toBeDefined();
            };

            var checkAllCollection = function(collection) {
                expect(collection.name).toEqual("all");
                expect(collection._links).toBeDefined();
            };
            
            async.it("should retrieve a Collection by ID", function(done) {
                celapi.getMuseum(museum_id).then(checkCollections).then(done, done, done);
            });

            async.it("should retrieve the ALL virtual Collection", function(done) {
                celapi.getCollection(museum_id).then(checkAllCollection).then(done, done, done);
            });
    
        });
        
        describe("Objects", function() {

            var museum_id = "MCM",
                collection_id = "Àfrica",
                object_id = "329618";
            
            var checkObjects = function(objects) {
                expect(objects.objects instanceof Array).toBeTruthy();
                expect(objects.objects.length).toBeGreaterThan(0);
                expect(objects.page).toBeDefined();
                expect(objects._links).toBeDefined();
            };
            
            var checkObject = function(object) {
                expect(object._links).toBeDefined();
            };

            var checkComplete = function(object) {
                expect(object.identifiers instanceof Array).toBeTruthy();
            };

            async.it("should retrieve the Objects of a collection", function(done) {
                celapi.getObjects(museum_id, collection_id).then(checkObjects).then(done, done, done);
            });

            async.it("should retrieve an object", function(done) {
                celapi.getObject(museum_id, collection_id, object_id).then(checkObject).then(done, done, done);                
            });

            async.it("should retrieve a complete object description", function(done) {
                celapi.getComplete(museum_id, collection_id, object_id).then(checkComplete).then(done, done, done);
            });
            
            xdescribe("Filters", function(done) {
                async.it("should filter objects by different fields", function(done) {
                    throw 'but it is not yet implemented';
                });
                
            });

            xdescribe("Pagination", function(done) {
                
                async.it("should return paginated results", function(done) {
                    throw 'but it is not yet implemented';
                });
                
            });

            xdescribe("Sorting", function(done) {
                
                async.it("should sort objects by title, author or date in ascending or descending order", function(done) {
                    throw 'but it is not yet implemented';
                });
                
            });

        });

        describe("Field list", function() {
            
            var museum_id = "MCM",
                collection_id = "Àfrica";

            var checkFieldValues = function(fields) {
                expect(fields instanceof Array).toBeTruthy();
                $.each(fields, function(i, field) {
                    expect(field.name).toBeDefined();
                    expect(field.description).toBeDefined();
                    expect(field._links).toBeDefined();
                    expect(field.values instanceof Array).toBeTruthy();
                    $.each(field.values, function(i, value) {
                        expect(value.value).toBeDefined();
                        expect(value.count).toBeGreaterThan(0);
                    });
                });
            };
            
            async.it("should retrieve all the distinct field values in a collection", function(done) {
                celapi.getFieldValues(museum_id, collection_id).then(checkFieldValues).then(done, done, done);
            });
                     
        });

    });
});
