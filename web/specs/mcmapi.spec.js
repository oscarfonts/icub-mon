/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */

// See API specification at http://docs.celapi.apiary.io/
define(["mcmapi"], function(mcm) {
    
    var async = new AsyncSpec(this);
    
    describe("MCM API", function() {
               
        var error = function(response) {
            jasmine.getEnv().currentSpec.fail(Error(JSON.stringify(response)));
        };
        
        var notImplemented = function(param) {
            jasmine.getEnv().currentSpec.fail(Error("Not implemented yet"));
            return param;
        };
        
        describe("Get geometries", function() {
        
            var continent_id = "Àfrica",
                culture_id = "Cultura Fang",
                object_id = "329618";

            var checkContinents = function(continents) {
                notImplemented();
            };
            
            var checkAllCultures = function(cultures) {
                notImplemented();
            };
            
            var checkCulturesForContinent = function(cultures) {
                notImplemented();
            };

            var checkCulture = function(culture) {
                notImplemented();
            };

            var checkAllObjects = function(objects) {
                notImplemented();
            };
            
            var checkObjectsForCulture = function(objects) {
                notImplemented();
            };

            var checkObject = function(object) {
                notImplemented();
            };

            async.it("should retrieve all continents", function(done) {
                mcm.continent.list().then(checkContinents, error).then(done, done);
            });

            async.it("should retrieve all culture locations", function(done) {
                mcm.culture.list().then(checkAllCultures, error).then(done, done);
            });
            
            async.it("should retrieve the culture locations for a given continent", function(done) {
                mcm.culture.list(continent_id).then(checkCulturesForContinent, error).then(done, done);
            });

            async.it("should retrieve a single culture location", function(done) {
                mcm.culture.get(culture_id).then(checkCulturesForContinent, error).then(done, done);
            });

            async.it("should retrieve all object locations", function(done) {
                mcm.object.list().then(checkAllObjects, error).then(done, done);
            });
            
            async.it("should retrieve the object locations for a given culture", function(done) {
                mcm.object.list(culture_id).then(checkObjectsForCulture, error).then(done, done);
            });
            
            async.it("should retrieve a single object location", function(done) {
                mcm.object.get(object_id).then(checkObject, error).then(done, done);
            });

        });
        
        describe("HTML descriptions", function() {

            var id = "Cultura Fang",
                description = "hola",
                description2 = "chau";

            var checkCreated = function(response) {
                notImplemented();
            };

            var checkRetrieved = function(description) {
                notImplemented();
            };
            
            var checkUpdated = function(response) {
                notImplemented();
            };

            var checkDeleted = function(response) {
                notImplemented();
            };

            async.it("should retrieve a description", function(done) {
                mcm.description.get(id).then(checkRetrieved, error).then(done, done);
            });
               
            async.it("should create a description", function(done) {
                mcm.description.create(id, description).then(checkCreated, error).then(done, done);
            });

            async.it("should update a description", function(done) {
                mcm.description.update(id, description2).then(checkUpdated, error).then(done, done);
            });
            
            async.it("should delete a description", function(done) {
                mcm.description.del(id).then(checkDeleted, error).then(done, done);
            });

        });
        
        describe("Edit features", function() {

            var culture_id = "Cultura Fang",
                object_id = "329618",
                feature = {
                    id: "1"
                },
                feature2 = {
                    id: "1"
                };
           
            var checkCreated = function(response) {
                notImplemented();
            };
            
            var checkUpdated = function(response) {
                notImplemented();
            };

            var checkDeleted = function(response) {
                notImplemented();
            };
            
            async.it("should create a culture geometry", function(done) {
                mcm.culture.create(feature).then(checkCreated, error).then(done, done);
            });

            async.it("should update a culture geometry", function(done) {
                mcm.culture.update(feature2).then(checkUpdated, error).then(done, done);
            });

            async.it("should delete a culture geometry", function(done) {
                mcm.culture.del(culture_id).then(checkDeleted, error).then(done, done);
            });

            async.it("should create an object geometry", function(done) {
                mcm.object.create(feature).then(checkCreated, error).then(done, done);
            });

            async.it("should update an object geometry", function(done) {
                mcm.object.update(feature2).then(checkUpdated, error).then(done, done);
            });

            async.it("should delete an object geometry", function(done) {
                mcm.object.del(object_id).then(checkDeleted, error).then(done, done);
            });

        });

    });
});
