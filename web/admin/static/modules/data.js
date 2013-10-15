define(["eventbus"], function(events) {
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
                events.send("data.loaded", data);
            }
        });  
    }
    
    download("../api/continent", data.continents);
    download("../api/cultura",   data.cultures);
    download("../api/peca",      data.peces);    

});
