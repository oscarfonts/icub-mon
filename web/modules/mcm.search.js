/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(["mcm.i18n", "messagebus", "template", "cel.api", "jquery", "bootstrap-select"], function(i18n, bus, template, api, $) {

    $("#simple-search").submit(function(e) {
        e.preventDefault();
        bus.publish("mcm.search.text", $("#search-text").val());
    });

    function toggle() {
        var panel = $("#advanced-search-container");
        panel.toggle();
        bus.publish("mcm.search.toggle", panel.is(':visible'));
    };

    function show() {
        var fields = "name=dateFrom&name=dateTo&name=author&name=culture&name=provenance";
        api.collection.fields("MCM", "all", fields).then(render);
    }

	function render(lists) {
		var data = {
			labels : {
				search : i18n.translate('search_text'),
				dateFrom : i18n.translate('search_from'),
				dateTo : i18n.translate('search_until'),
				collectionId : i18n.translate('search_continent'),
				culture : i18n.translate('search_culture'),
				provenance : i18n.translate('search_origin'),
				author : i18n.translate('search_autor'),
				recordNumber : i18n.translate('search_inventory_number'),
				submit : i18n.translate('search')
			},
			fields : []
		};
		
		$.each(lists, function(i, list) {
			var name = list.name;
			var values = $.map(list.values, function(val, i) {
				return val.value;
			});
			data.fields.push({
				name : name,
				label : data.labels[name],
				values : values
			});
		});
		return template.render("mcm.search", data, "advanced-search-container").then(add_interactivity);
	}

    function add_interactivity() {
        $("#advanced-search select.selectpicker").selectpicker();
        $("#advanced-search-container button.close").click(toggle);
        $("#advanced-search").submit(function(e) {
            e.preventDefault();
            var values = {};
            $.each($(this).serializeArray(), function(i, v) {
                if (v.value) {
                    values[v.name] = v.value;
                }
            });
            bus.publish("mcm.search.advanced", values);
        });
    }

    return {
        show: show,
        toggle: toggle
    };
});
