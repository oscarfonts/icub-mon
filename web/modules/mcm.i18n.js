/**
 * @author Micho García <micho.garcia@geomati.co>
 */
define(['jquery', 'jquery-i18n'], function($) {

	return {
		
		init : function() {
			console.log(window.location);
		},

		setLang : function(lang) {
			$.i18n.properties({
				name : 'messages',
				path : 'bundle/',
				mode : 'both',
				language : lang,
				cache : false, //set true in production 
				callback : function() {
					console.log('setting language: ' + this.language);
				}
			});
		},
		
		translate : function() {
			
			var key = (arguments.length > 0) ? arguments[0] : null;
			
			if (arguments.length = 2) 
				return $.i18n.prop(key, arguments[1]);
				
			return $.i18n.prop(key);
		}
	};
});
