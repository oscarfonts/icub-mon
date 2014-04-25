/**
 * @author Micho García <micho.garcia@geomati.co>
 */
define(['jquery', 'jquery-i18n'], function($) {

	$.extend({
		getUrlVars : function() {
			var vars = [], hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		},
		getUrlVar : function(name) {
			return $.getUrlVars()[name];
		}
	});

	return {

		init : function() {
			var language = $.getUrlVar('lang');
			this.setLang(language);
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
