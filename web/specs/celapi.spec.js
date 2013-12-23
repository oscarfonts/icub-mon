/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */

// See API specification at http://docs.celapi.apiary.io/
define(["celapi"], function(celapi) {
    
    var async = new AsyncSpec(this);
    
    describe("Celapi", function() {
        
        var museum_id = "MCM",
            collection_id = "Àfrica",
            object_id = "329618";
        
        var error = function(response) {
            jasmine.getEnv().currentSpec.fail(Error(JSON.stringify(response)));
        };
        
        var notImplemented = function(param) {
            jasmine.getEnv().currentSpec.fail(Error("Not implemented yet"));
            return param;
        };
        
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
                return celapi.museum.get(id);
            };

            async.it("should list all Museums", function(done) {
                celapi.museum.list().then(checkMuseums, error).then(done, done);
            });

            async.it("should retrieve a Museum by ID", function(done) {
                celapi.museum.list().then(selectMuseumById).then(checkMuseum, error).then(done, done);
            });

            async.it("should retrieve the ALL virtual Museum", function(done) {
                celapi.museum.get().then(checkAllMuseum, error).then(done, done);
            });            
            
        });
        
        describe("Collections", function() {

            var checkCollections = function(museum) {
                $.each(museum.collections, function(i, collection) {
                    celapi.collection.get(museum.acronym, collection.name).then(checkCollection);
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
                celapi.museum.get(museum_id).then(checkCollections, error).then(done, done);
            });

            async.it("should retrieve the ALL virtual Collection", function(done) {
                celapi.collection.get(museum_id).then(checkAllCollection, error).then(done, done);
            });
    
        });
        
        describe("Objects", function() {
           
            var checkObjects = function(objects) {
                expect(objects.objects instanceof Array).toBeTruthy();
                expect(objects.objects.length).toBeGreaterThan(0);
                expect(objects.page).toBeDefined();
                expect(objects._links).toBeDefined();
            };
            
            var checkObject = function(object) {
                expect(object._links).toBeDefined("Object links not found");
            };

            var checkComplete = function(object) {
                expect(object.identifiers instanceof Array).toBeTruthy("Object identifiers not found");
            };

            async.it("should retrieve the Objects of a collection", function(done) {
                celapi.object.list(museum_id, collection_id).then(checkObjects, error).then(done, done);
            });

            async.it("should retrieve an object", function(done) {
                celapi.object.get(museum_id, collection_id, object_id).then(checkObject, error).then(done, done);
            });

            async.it("should retrieve a complete object description", function(done) {
                celapi.object.details(museum_id, collection_id, object_id).then(checkComplete, error).then(done, done);
            });
            
            xdescribe("Filters", function(done) {
                async.it("should filter objects by different fields", function(done) {
                    notImplemented();
                    done();
                });
            });

            xdescribe("Pagination", function(done) {
                
                async.it("should return paginated results", function(done) {
                    notImplemented();
                    done();
                });
                
            });

            xdescribe("Sorting", function(done) {
                
                async.it("should sort objects by title, author or date in ascending or descending order", function(done) {
                    notImplemented();
                    done();
                });
                
            });

        });

        describe("Field list", function() {

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
                celapi.collection.fields(museum_id, collection_id).then(checkFieldValues, error).then(done, done);
            });

        });

    });
});
