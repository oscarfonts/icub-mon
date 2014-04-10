/**
 * @author Micho García <micho.garcia@geomati.co>
 */
define(['jquery', 'jquery-i18n'], function($) {

	return {

		init : function() {
			$.i18n.properties({
				name : 'messages',
				path : 'bundle/',
				mode : 'both',
				language : 'ca',
				cache : false, //set true in production 
				callback : function() {
					
				}
			});
		}
	};
});
