define(["eventbus", "jquery", "data.feature", "bootstrap", "data.contents"], function(events, $, features) {

    events.listen("data.contents.loaded", renderContinents);
    
    events.listen("data.feature.listed",  markItemsWithGeometry);
    
    events.listen("map.editor.featureCreated", function(event, data) {
        addIcon("#"+data.type+data.id, "glyphicon-map-marker");
    });
    
    events.listen("map.editor.featureDeleted", function(event, data) {
        removeIcon("#"+data.type+data.id);
    });

    
    function renderContinents(event, data) {
        for (i in data.continents) {
            continent = data.continents[i];
            $("#tree")
            .append($('<li>')
                .attr('id', "continent"+continent.id)
                .append($('<a>')
                    .attr('data-toggle', "collapse")
                    .attr('data-parent', "#tree")
                    .attr('data-target', "#continent"+continent.id+" > ul")
                    .on('click', continent, selectContinent)
                    .append(continent.nom)
                )
            );
            renderCultures(continent.id, data);
        }
        features.list("cultura");
        features.list("peca");
    }
    
    function renderCultures(continentId, data) {
        var cultures = data.cultures.filter(function (el) {
            return el.continent == continentId;
        });
        for (i in cultures) {
            cultura = cultures[i];
            $('#continent'+continentId)
            .append($('<ul>')
                .addClass("collapse")
                .addClass("nav")
                .append($('<li>')
                    .attr('id', "cultura"+cultura.id)
                    .append($('<a>')
                        .attr('data-toggle', "collapse")
                        .attr('data-parent', '#continent'+continentId)
                        .attr('data-target', "#cultura"+cultura.id+" > ul")
                        .on('click', cultura, selectCultura)
                        .append(cultura.nom + " (" + cultura.id + ")")
                    )
                )
            );
            renderPeces(cultura.id, data);
        }
    }

    function renderPeces(culturaId, data) {
        var peces = data.peces.filter(function (el) {
            return el.cultura == culturaId;
        });
        for (i in peces) {
            peca = peces[i];
            $('#cultura'+culturaId)
            .append($('<ul>')
                .addClass("nav")
                .addClass("collapse")
                .append($('<li>')
                    .attr('id', "peca"+peca.id)
                    .append($('<a>')
                        .on('click', peca, selectPeca)
                        .append(peca.num_registre)
                    )
                )
            );
        }

    }
    
    function markItemsWithGeometry(event, data) {
        var type = data.type;
        for (i in data.features.features) {
            var id = data.features.features[i].id;
            addIcon("#"+type+id, "glyphicon-map-marker");
        }
    }
    
    function addIcon(elem, icon) {
        $(elem).children().first().prepend(" ").prepend($("<span> ").addClass("glyphicon "+icon));
    }
    
    function removeIcon(elem, icon) {
        $(elem).children().first().children().first().detach();
    }

    function selectContinent(event) {
        var continent = event.data;
        $("#tree .in").removeClass("in").addClass("collapse");
        $("#tree .active").removeClass("active");
        $("#continent"+continent.id+"").addClass("active");
        events.send("tree.continentSelected", continent);
    }
    
    function selectCultura(event) {
        var cultura = event.data;
        $("#tree > li > ul > li .in").removeClass("in").addClass("collapse");
        $("#tree .active").removeClass("active");
        $("#cultura"+cultura.id+"").addClass("active");
        events.send("tree.culturaSelected", cultura);
    }

    function selectPeca(event) {
        var peca = event.data;
        $("#tree .active").removeClass("active");
        $("#peca"+peca.id+"").addClass("active");
        events.send("tree.pecaSelected", peca);
    }
    
});
