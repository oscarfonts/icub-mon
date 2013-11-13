define(["chap-timeline"], function() {
    
    function draw(peces) {
        var timelines = [];

        for (i in peces) {
            var peca = peces[i];
            var container = document.getElementById('timeline'+peca.id);
            var timeline = new links.Timeline(container);

            data = [{
                start: new Date(peca.any_inici, 00, 01),
                end: new Date(peca.any_final, 11, 31),
                className: 'btn btn-xs btn-warning',
                content: peca.datacio
            }];

            var options = {
                locale: "ca",
                animate: false,
                animateZoom: false,
                showCurrentTime: false,
                showMajorLabels: false,
                selectable: false,
                zoomMin: 5 * 365 * 24 * 60 * 60 * 1000 // About seven years, in milliseconds
            };
        
            timeline.draw(data, options);
            timelines.push(timeline);
        }

        window.onresize = function() {
            for (i in timelines) {
                timeline = timelines[i];
                timeline.checkResize.call(timeline);
            }
        };
    };
      
    return {
        draw: draw
    };
});
