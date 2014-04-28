/**
 * @author Micho García <micho.garcia@geomati.co>
 */
define(['jquery', 'jquery-i18n'], function($) {
	
	"use strict";

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
	
	function setLanguageInControl(language) {
		$('.language-selector .active').removeClass('active');
		$('a:lang(' + language + ')').parent().addClass('active');	
	};

	return {

		init : function() {
			var language = $.getUrlVar('lang');
			this.setLang((language != undefined) ? language : 'ca');
		},

		setLang : function(lang) {
			$.i18n.properties({
				name : 'messages',
				path : 'bundle/',
				mode : 'both',
				encoding : 'UTF-8',
				language : lang,
				cache : false, //set true in production,
				callback : function() {				
				}
			});
		},

		translate : function() {
			var key = (arguments.length > 0) ? arguments[0] : undefined;
			if (key == undefined)
				throw 'Not key to translate';
			if (arguments[1] != undefined) {
				return $.i18n.prop(key, arguments[1]);
			}
			return $.i18n.prop(key);
		}
	};
});
