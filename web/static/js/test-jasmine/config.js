var specs =
    [ 'sample.jasmine'
    , 'messagebus.jasmine',
    , 'celapi'
    ];

var BASE_PATH = "../modules/",
    SPEC_PATH = "../specs/",
    LIB_PATH = "../lib/";

require.config({
    baseUrl: BASE_PATH,
    paths: {
        'jquery': LIB_PATH + 'jquery',
        'jasmine': LIB_PATH + 'jasmine',
        'jasmine-html': LIB_PATH + 'jasmine-html',
        'jasmine-async': LIB_PATH + 'jasmine.async.min'
    },
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-async': {
            deps: ['jasmine']
        }
    }
});

require(['jasmine', 'jasmine-html', 'jasmine-async'], function() {

    for (i in specs) {
        specs[i] = SPEC_PATH + specs[i] + '.spec'
    }

    require(specs, function() {
        // Set Jasmine reporter
        var env = jasmine.getEnv();
        var reporter = new jasmine.HtmlReporter();
        env.addReporter(reporter);

        // Set filtering
        env.specFilter = function(spec) {
            return reporter.specFilter(spec);
        };

        // Run tests
        env.execute();
    });
});
