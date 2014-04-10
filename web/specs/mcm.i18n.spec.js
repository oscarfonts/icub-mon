/**
 * @author Micho García <micho.garcia@geomati.co>
 */
define(['mcm.i18n'], function(i18n) {
	
	describe("i18n tests:", function() {
		
		i18n.setLang('ca');
		it('translate one key', function() {
			expect(i18n.trans('fakekey')).toBe('faketranslate_ca');
		});
		
		it('translate one key with one value', function() {
			expect(i18n.trans('fakekey_more', 'fakevalue')).toBe('faketranslate_ca fakevalue');
		});
		
		it('translate one key from another language', function() {
			var language = 'fr';
			i18n.setLang(language);
			expect(i18n.trans('fakekey')).toBe('faketranslate_' + language);
		});
		
		it('translate one key with no language messages file', function() {
			i18n.setLang('pt');
			expect(i18n.trans('fakekey')).toBe('faketranslate_defaults');
		});
	});
});