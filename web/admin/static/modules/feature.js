define(["eventbus"], function(events) {
    
    events.listen("tree.continentSelected", function(event) {
        events.send("feature.clear");
    });
    
    events.listen("tree.culturaSelected", function(event, cultura) {
        retrieve("cultura", cultura.id);
    });
    
    events.listen("tree.pecaSelected", function(event, peca) {
        retrieve("peca", peca.id);
    });

    events.listen("editor.created", function(event, data) {
        create(data.type, data.id, data.feature);
        retrieve(data.type, data.id);
    });

    events.listen("editor.edited", function(event, data) {
        update(data.type, data.id, data.feature);
        retrieve(data.type, data.id);
    });

    events.listen("editor.deleted", function(event, data) {
        del(data.type, data.id);
        retrieve(data.type, data.id);
    });

   
    function create(type, id, feature) {
        $.ajax({
            type: 'POST',
            url: "api/" + type + "_geometry",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(feature),
            success: function(responseData, textStatus, jqXHR) {
                console.log("Feature " + id + " created successfully");
            },
            error: function (responseData, textStatus, errorThrown) {
                console.log("Error creating feature " + id);
            }
        });
    }
    
    function retrieve(type, id) {
        $.ajax({
            url: "api/" + type + "_geometry/" + id,
            dataType: "json"
        }).done(function(response) {
            events.send("feature.load", {type: type, id: id, feature: response});
        }).fail(function(xhr) {
            if (xhr.status == 404) {
                events.send("feature.new", {type: type, id: id});
            } else {
                alert("Error carregant "+ type + " " + id + ". El servidor diu: " + xhr.statusText);
            }
        });
    }
   
    function update(type, id, feature) {
        $.ajax({
            type: 'PUT',
            url: "api/" + type + "_geometry/" + id,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(feature),
            success: function(responseData, textStatus, jqXHR) {
                console.log("Feature " + id + " updated successfully");
            },
            error: function (responseData, textStatus, errorThrown) {
                console.log("Error updating feature " + id);
            }
        });
    }
    
    function del(type, id) {
        $.ajax({
            type: 'DELETE',
            url: "api/" + type + "_geometry/" + id,
            dataType: "json",
            success: function(responseData, textStatus, jqXHR) {
                console.log("Feature " + id + " deleted successfully");
            },
            error: function (responseData, textStatus, errorThrown) {
                console.log("Error deleting feature " + id);
            }
        });
    }

});
