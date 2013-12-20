define(["eventbus", "module"], function(events, module) {
    var data = {
        continents: [],
        cultures: [],
        peces: []
    };

    function download(url, target) {
        if (!isReady()) {
            $.ajax({
                url: url,
                dataType: "json"
            }).done(function(response) {
                target.push.apply(target, response.objects);
                if (isReady()) {
                    events.send("data.contents.loaded", data);
                }
            });
        }
    }
    
    function isReady() {
        return (data.continents.length && data.cultures.length && data.peces.length);
    }
    
    function onGet(callback) {
        callback();
    }
    
    function list(type, filter, callback) {
        var url = api_url + type + "?q=" + JSON.stringify(filter);
        $.ajax({
                url: url,
                dataType: "json"
            }).done(function(response) {
                callback(response.objects);
            });
    }
    
    function get(type, id) {
        for (i in data[type]) {
            var item = data[type][i];
            if (item.id == id) {
                return item;
            }
        }
        return {};
    }
    
    function getFirstPecaOfCulture(id) {
        for (i in data.peces) {
            if (data.peces[i].cultura == id) {
                return data.peces[i];
            }
        }
        return {};
    }
    
    var api_url = module.config().api_url;
    
    download(api_url + "continent", data.continents);
    download(api_url + "cultura", data.cultures);
    download(api_url + "peca", data.peces);
    
    return {
        list: list,
        get: get,
        getFirstPecaOfCulture: getFirstPecaOfCulture
    };

});
