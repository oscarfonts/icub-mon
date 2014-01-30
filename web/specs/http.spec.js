/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['http', 'module'], function(http, module) {
    
    var async = new AsyncSpec(this);
    
    var baseURL = module.config().url ? module.config().url : "http://fonts.cat/icub/api";
    
    describe("HTTP Client", function() {
               
        var error = function(response) {
            jasmine.getEnv().currentSpec.fail(Error(JSON.stringify(response)));
        };
        
        var notImplemented = function(param) {
            jasmine.getEnv().currentSpec.fail(Error("Not implemented yet"));
            return param;
        };
        
        var checkGet = function(response) {
            expect(response).toBeDefined();
        };
        
        var checkPost = function(response) {
            expect(response).toEqual(data1);
        };
        
        var checkPut = function(response) {
            expect(response).toEqual(data2);
        };
        
        var checkDelete = function(response) {
            expect(response).not.toBeDefined();
        };
        
        user = "test";
        password = "test";
       
        var data1 = {
            id: "test",
            html: "first description"
        };
        
        var data2 = {
            id: "test",
            html: "second description"
        };

        async.it("should GET an http resource", function(done) {
            var url = baseURL + "/continent";
            http.get(url).then(checkGet, error).then(done, done);
        });

        async.it("should POST an http resource using credentials", function(done) {
            var url = baseURL + "/description_ca";
            http.auth.set(user, password);
            http.post(url, data1).then(checkPost, error).then(done, done);
            http.auth.clear();
        });

        async.it("should PUT an http resource using credentials", function(done) {
            var url = baseURL + "/description_ca/test";
            http.auth.set(user, password);
            http.put(url, data2).then(checkPut, error).then(done, done);
            http.auth.clear();
        });
        
        async.it("should DELETE an http resource using credentials", function(done) {
            var url = baseURL + "/description_ca/test";
            http.auth.set(user, password);
            http.del(url).then(checkDelete, error).then(done, done);
            http.auth.clear();
        });

    });
});
