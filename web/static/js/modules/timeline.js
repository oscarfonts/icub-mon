define(["eventbus", "data.contents", "chap-timeline"], function(events, data) {
    
    function draw(peces) {

        var data = [];
        var any_min = Number.MAX_VALUE;
        var any_max = Number.MIN_VALUE;
        
        for (i in peces) {
            var peca = peces[i];
            data.push({
                start: new Date(peca.any_inici, 00, 01),
                end: new Date(peca.any_final, 11, 31),
                className: 'btn btn-xs btn-warning',
                content: peca.num_registre
            });
            any_min = Math.min(any_min, peca.any_inici);
            any_max = Math.max(any_max, peca.any_final);
        }

        if (data.length > 0) {
            var container = document.getElementById('timeline');
            var timeline = new links.Timeline(container);        

            var options = {
              locale: "ca",
              width: "85%",
              cluster: "true",
              //min: new Date(any_min-10, 00, 01),
              //max: new Date(any_max+10, 11, 31),
              showCurrentTime: false,
              selectable: true,
              zoomMin: 5 * 365 * 24 * 60 * 60 * 1000 // About seven years, in milliseconds
            };
        
            timeline.draw(data, options);
        }
    }
    
    return {
        draw: draw
    };
});
