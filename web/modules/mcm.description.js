/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["mcm.api"], function(mcm) {

    var div_id = "description";

    function show(id, lang) {
        return mcm.description.get(id, lang).then(render);
    }

    function render(description) {
        document.getElementById(div_id).innerHTML = description.html;
    }

    function hide() {
        document.getElementById(div_id).innerHTML = "";
    }
    
    return {
        show: show,
        hide: hide,
        div: function(div) {
            if (div) {
                div_id = div;
            }
            return div_id;
        }
    };
    
});
