/**
 * @author Micho García <micho.garcia@geomati.co>
 */
define(['jquery', 'jquery-i18n'], function($) {

	return {

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
		
		trans : function() {
			
			var key = (arguments.length > 0) ? arguments[0] : null;
			
			if (arguments.length = 2) 
				return $.i18n.prop(key, arguments[1]);
				
			return $.i18n.prop(key);
		}
	};
});
