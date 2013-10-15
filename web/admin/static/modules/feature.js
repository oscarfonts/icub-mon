define(["eventbus"], function(events) {
    
    events.listen("tree.culturaSelected", function(event, cultura) {
        retrieve("cultura", cultura.id);
    });
    
    events.listen("tree.pecaSelected", function(event, peca) {
        retrieve("peca", peca.id);
    });
    
    function create(type, id, feature) {
        // TODO: Persist geometry
        alert("Should be creating " + type + " " + id);
    }
    
    function retrieve(type, id) {
        $.ajax({
            url: "api/" + type + "_geometry/" + id,
            dataType: "json"
        }).done(function(response) {
            events.send("feature.loaded", {type: type, id: id, feature: response});
        }).fail(function(xhr) {
            if (xhr.status == 404) {
                events.send("feature.notfound", {type: type, id: id});
            } else {
                alert("Error carregant "+ type + " " + id + ". El servidor diu: " + xhr.statusText);
            }
        });
    }
   
    function update(type, id, feature) {
        // TODO: Persist geometry
        alert("Should be updating " + type + " " + id);
    }
    
    function del(type, id) {
        // TODO: Persist geometry
        alert("Should be deleting " + type + " " + id);
    }

});
