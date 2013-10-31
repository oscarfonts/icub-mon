define(["eventbus", "module"], function(events, module) {
    var data = {
        continents: [],
        cultures: [],
        peces: []
    };

    function download(url, target) {
        $.ajax({
            url: url,
            dataType: "json"
        }).done(function(response) {
            target.push.apply(target, response.objects);
            if (data.continents.length && data.cultures.length && data.peces.length) {
                events.send("data.contents.loaded", data);
            }
        });  
    }
    
    var api_url = module.config().api_url;
    
    download(api_url + "continent", data.continents);
    download(api_url + "cultura", data.cultures);
    download(api_url + "peca", data.peces);    

});
