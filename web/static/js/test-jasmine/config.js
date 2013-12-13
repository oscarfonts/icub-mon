var specs =
    [ 'sample.jasmine'
    , 'messagebus.jasmine'
    ];

var BASE_PATH = "../modules/",
    SPEC_PATH = "../specs/",
    LIB_PATH = "../lib/";

require.config({
    baseUrl: BASE_PATH,
    paths: {
        'jquery': LIB_PATH + 'jquery',
        'jasmine': LIB_PATH + 'jasmine',
        'jasmine-html': LIB_PATH + 'jasmine-html'
    },
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        }
    }
});

require(['jasmine', 'jasmine-html'], function() {

    for (i in specs) {
        specs[i] = SPEC_PATH + specs[i] + '.spec'
    }

    require(specs, function() {
        // Set Jasmine reporter
        var env = jasmine.getEnv(),
            reporter = new jasmine.HtmlReporter();
        env.addReporter(reporter);

        // Set filtering
        env.specFilter = function(spec) {
            return reporter.specFilter(spec);
        };

        // Run tests
        env.execute();
    });
});
