define(["jquery", "eventbus", "data"], function($, events) {
    events.listen(
        "data.loaded", renderContinents
    );
    
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
                        .append(cultura.nom)
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

    // TODO send messages => bind map feature editing!
    
    function selectContinent(event) {
        var continent = event.data;
        $("#tree .in").removeClass("in").addClass("collapse");
        $("#tree .active").removeClass("active");
        $("#continent"+continent.id+"").addClass("active");
    }
    
    function selectCultura(event) {
        var cultura = event.data;
        $("#tree > li > ul > li .in").removeClass("in").addClass("collapse");
        $("#tree .active").removeClass("active");
        $("#cultura"+cultura.id+"").addClass("active");
    }

    function selectPeca(event) {
        var peca = event.data;
        $("#tree .active").removeClass("active");
        $("#peca"+peca.id+"").addClass("active");
    }
    
});
