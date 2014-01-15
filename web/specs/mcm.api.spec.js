/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */

// See API specification at http://docs.celapi.apiary.io/
define(["mcm.api"], function(mcm) {
    
    var async = new AsyncSpec(this);
    
    user = "test";
    password = "test";
    
    describe("MCM API", function() {
               
        var error = function(response) {
            jasmine.getEnv().currentSpec.fail(Error(JSON.stringify(response)));
        };
        
        var notImplemented = function(param) {
            jasmine.getEnv().currentSpec.fail(Error("Not implemented yet"));
            return param;
        };
        
        var checkNotOk = function(response) {
            jasmine.getEnv().currentSpec.fail(Error("Server should have returned an unauthorized header!"));
        };

        var checkUnauthorized = function(response) {
            expect(response.error).toBeDefined();
            expect(response.code).toBeDefined();
            expect(response.code).toEqual(401); // 401 Unauthorized
        };

        describe("Edit locations", function() {

            var culture = {
                type: "Feature",
                id: "Test Culture",
                properties: {
                    continent: "africa"
                },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [[[[57.7,-20.5],[57.3,-20.5],[57.6,-20.0],[57.8,-20.2],[57.7,-20.5]]]]
                }
            };
            
            var culture2 = {
                type: "Feature",
                id: "Test Culture",
                properties: {
                    continent: "africa"
                },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [[[[50.7,-27.5],[50.3,-27.5],[50.6,-27.0],[50.8,-27.2],[50.7,-27.5]]]]
                }
            };

            var object = {
                type: "Feature",
                id: 1,
                properties: {
                    culture: "Test Culture"
                },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [[[[57.7,-20.5],[57.3,-20.5],[57.6,-20.0],[57.8,-20.2],[57.7,-20.5]]]]
                }
            };

            var object2 = {
                type: "Feature",
                id: 1,
                properties: {
                    culture: "Test Culture"
                },
                geometry: {
                    type: "MultiPolygon",
                    coordinates: [[[[50.7,-27.5],[50.3,-27.5],[50.6,-27.0],[50.8,-27.2],[50.7,-27.5]]]]
                }
            };
                     
            var checkCultureCreated = function(response) {
                expect(response).toEqual(culture);
            };
            
            var checkCultureRetrieved = function(response) {
                expect(response).toEqual(culture);
            };

            var checkCultureUpdated = function(response) {
                expect(response).toEqual(culture2);
            };

            var checkObjectCreated = function(response) {
                expect(response).toEqual(object);
            };
            
            var checkObjectRetrieved = function(response) {
                expect(response).toEqual(object);
            };

            var checkObjectUpdated = function(response) {
                expect(response).toEqual(object2);
            };

            var checkDeleted = function(response) {
                expect(response).not.toBeDefined();
            };
            
            async.it("should ask for credentials on feature editing", function(done) {
                mcm.auth.clear();
                mcm.culture.create(culture).then(checkNotOk, checkUnauthorized).then(done, done);
            });
            
            async.it("should create a culture location", function(done) {
                mcm.auth.set(user, password);
                mcm.culture.create(culture).then(checkCultureCreated, error).then(done, done);
            });

            async.it("should retrieve a culture location", function(done) {
                mcm.culture.get(culture.id).then(checkCultureRetrieved, error).then(done, done);
            });

            async.it("should update a culture location", function(done) {
                mcm.culture.update(culture2).then(checkCultureUpdated, error).then(done, done);
            });

            async.it("should create an object location", function(done) {
                mcm.object.create(object).then(checkObjectCreated, error).then(done, done);
            });

            async.it("should retrieve an object location", function(done) {
                mcm.object.get(object.id).then(checkObjectRetrieved, error).then(done, done);
            });

            async.it("should update an object location", function(done) {
                mcm.object.update(object2).then(checkObjectUpdated, error).then(done, done);
            });

            async.it("should delete an object location", function(done) {
                mcm.object.del(object.id).then(checkDeleted, error).then(done, done);
            });

            async.it("should delete a culture location", function(done) {
                mcm.culture.del(culture.id).then(checkDeleted, error).then(done, done);
            });

        });

        describe("Edit descriptions", function() {

            description = {
                id: "Test Description",
                html: "Description Content 1"
            };
            
            description2 = {
                id: "Test Description",
                html: "Description Content 2"
            };

            var checkCreated = function(response) {
                expect(response).toEqual(description);
            };

            var checkRetrieved = function(response) {
                expect(response).toEqual(description);
            };
            
            var checkUpdated = function(response) {
                expect(response).toEqual(description2);
            };

            var checkDeleted = function(response) {
                expect(response).not.toBeDefined();
            };

            async.it("should ask for credentials on description editing", function(done) {
                mcm.auth.clear();
                mcm.description.create(description).then(checkNotOk, checkUnauthorized).then(done, done);
            });
              
            async.it("should create a description", function(done) {
                mcm.auth.set(user, password);
                mcm.description.create(description).then(checkCreated, error).then(done, done);
            });

            async.it("should retrieve a description", function(done) {
                mcm.description.get(description.id).then(checkRetrieved, error).then(done, done);
            });

            async.it("should update a description", function(done) {
                mcm.description.update(description2).then(checkUpdated, error).then(done, done);
            });
            
            async.it("should delete a description", function(done) {
                mcm.description.del(description.id).then(checkDeleted, error).then(done, done);
            });

            async.it("should support multilanguage descriptions", function(done) {
                notImplemented();
                done();
            });

        });

        describe("Get collections", function() {
        
            var continent_id = "africa",
                culture_id = "Cultura Fang",
                object_id = "329618";

            var checkContinents = function(continents) {
                expect(continents.type).toEqual("FeatureCollection");
                expect(continents.features instanceof Array).toBeTruthy();
                expect(continents.features.length).toEqual(4);
            };
            
            var checkAllCultures = function(cultures) {
                expect(cultures.type).toEqual("FeatureCollection");
                expect(cultures.features instanceof Array).toBeTruthy();
            };
            
            var checkCulturesForContinent = function(cultures) {
                expect(cultures.type).toEqual("FeatureCollection");
                expect(cultures.features instanceof Array).toBeTruthy();
                $.each(cultures.features, function(index, feature) {
                    expect(feature.properties.continent).toEqual(continent_id);
                });
            };

            var checkAllObjects = function(objects) {
                expect(objects.type).toEqual("FeatureCollection");
                expect(objects.features instanceof Array).toBeTruthy();
            };
            
            var checkObjectsForCulture = function(objects) {
                expect(objects.type).toEqual("FeatureCollection");
                expect(objects.features instanceof Array).toBeTruthy();
                $.each(objects.features, function(index, feature) {
                    expect(feature.properties.culture).toEqual(cculture_id);
                });
            };

            async.it("should retrieve the four continents", function(done) {
                mcm.continent.list().then(checkContinents, error).then(done, done);
            });

            async.it("should retrieve all culture locations", function(done) {
                mcm.culture.list().then(checkAllCultures, error).then(done, done);
            });
            
            async.it("should retrieve the culture locations for a given continent", function(done) {
                mcm.culture.list(continent_id).then(checkCulturesForContinent, error).then(done, done);
            });

            async.it("should retrieve all object locations", function(done) {
                mcm.object.list().then(checkAllObjects, error).then(done, done);
            });
            
            async.it("should retrieve the object locations for a given culture", function(done) {
                mcm.object.list(culture_id).then(checkObjectsForCulture, error).then(done, done);
            });

        });

    });
});
