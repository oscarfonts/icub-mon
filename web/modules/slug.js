/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define([], function() {
    return function(text) {
        text = text.toLowerCase();
          
        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç";
        var to   = "aaaaaeeeeeiiiiooooouuuunc";
        for (var i=0, l=from.length ; i<l ; i++) {
            text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }
        
        return text.replace(/[^\w ]+/g,'') // remove anything not alphanumeric or spaces
                   .replace(/ +/g,'-');    // replace consecutive spaces with an hyphen
    };
});
