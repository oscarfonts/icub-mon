define(["eventbus", "module"], function(events, module) {
    
    category = module.config().category;
    
    events.listen("tree.continentSelected", function(event) {
        events.send("data.feature.none");
    });
    
    events.listen("tree.culturaSelected", function(event, cultura) {
        retrieve("cultura", cultura.id);
    });
    
    events.listen("tree.pecaSelected", function(event, peca) {
        retrieve("peca", peca.id);
    });

    events.listen("map.editor.featureCreated", function(event, data) {
        create(data.type, data.id, data.feature);
    });

    events.listen("map.editor.featureEdited", function(event, data) {
        update(data.type, data.id, data.feature);
    });

    events.listen("map.editor.featureDeleted", function(event, data) {
        del(data.type, data.id);
    });
    
    events.listen("details.getCultura", function(event, cultura_id) {
        retrieveCultura(cultura_id);
    });

    events.listen("details.setCultura", function(event, cultura) {
        updateCultura(cultura);
    });
   
    function create(type, id, feature) {
        $.ajax({
            type: 'POST',
            url: "api/" + type + "_" + category,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(feature),
            success: function(responseData, textStatus, jqXHR) {
                console.log("Feature " + id + " created successfully");
                retrieve(type, id);
            },
            error: function (responseData, textStatus, errorThrown) {
                console.log("Error creating feature " + id);
            }
        });
    }
    
    function retrieve(type, id) {
        $.ajax({
            url: "api/" + type + "_" + category + "/" + id,
            dataType: "json",
            success: function(response) {
                events.send("data.feature.read", {type: type, id: id, feature: response});
            },
            error: function(xhr) {
                if (xhr.status == 404) {
                    events.send("data.feature.notFound", {type: type, id: id});
                } else {
                    events.send("error", "Error reading feature " + id);
                }
            }
        });
    }
   
    function update(type, id, feature) {
        $.ajax({
            type: 'PUT',
            url: "api/" + type + "_" + category + "/" + id,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(feature),
            success: function() {
                events.send("data.feature.updated", {type: type, id: id, feature: feature});
                retrieve(type, id);
            },
            error: function () {
                events.send("error", "Error updating feature " + id);
            }
        });
    }
    
    function del(type, id) {
        $.ajax({
            type: 'DELETE',
            url: "api/" + type + "_" + category + "/" + id,
            dataType: "json",
            success: function() {
                events.send("data.feature.deleted", {type: type, id: id});
                retrieve(type, id);
            },
            error: function () {
                events.send("error", "Error deleting feature " + id);
            }
        });
    }
    
    function list(type) {
        $.ajax({
            url: "api/" + type + "_" + category,
            dataType: "json",
            success: function(response) {
                events.send("data.feature.listed", {type: type, features: response});
            },
            error: function() {
                events.send("error", "Error reading feature " + id);
            }
        });
    }
    
    function get(type, id, callback) {
        $.ajax({
            url: "api/" + type + "_" + category  + "/" + id,
            dataType: "json",
            success: callback,
            error: function() {
                events.send("error", "Error reading feature " + id);
            }
        });
    }
    
    function retrieveCultura(id) {
        $.ajax({
            url: "api/cultura/" + id,
            dataType: "json",
            success: function(response) {
                events.send("data.culturaRead", response);
            },
            error: function(xhr) {
                if (xhr.status == 404) {
                    events.send("culturaNotFound", id);
                } else {
                    events.send("error", "Error reading cultura " + id);
                }
            }
        });
    }
    
    function updateCultura(cultura) {
        $.ajax({
            type: 'PUT',
            url: "api/cultura/" + cultura.id,
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(cultura),
            success: function() {
                events.send("culturaUpdated", cultura);
                retrieveCultura(cultura.id);
            },
            error: function () {
                events.send("error", "Error updating cultura " + cultura.id);
            }
        });
    }
    
    return {
        list: list,
        get: get
    };

});
