var specs = [
    'messagebus',
    'http',
    'cel.api',
    'mcm.api'
];

var BASE_PATH = "../../modules/",
    SPEC_PATH = "../specs/",
    LIB_PATH = "../lib/";

require.config({
    baseUrl: BASE_PATH,
    paths: {
        'jquery': LIB_PATH + 'jquery-1.10.2',
        'jasmine': LIB_PATH + 'jasmine-1.3.1',
        'jasmine-html': LIB_PATH + 'jasmine-html-1.3.1',
        'jasmine-async': LIB_PATH + 'jasmine-async-0.1.0'
    },
    shim: {
        'jasmine-html': {
            deps: ['jasmine']
        },
        'jasmine-async': {
            deps: ['jasmine']
        }
    },
    config: {
        "cel.api": {
            url: "http://celapi.agilogy.net/api/1"
        },
        "mcm.api": {
            url: "http://localhost:5000/api"
        },
        "bootstrap.login": {
            url: "http://localhost:5000/api/login"
        }
    }
});

require(['jasmine', 'jasmine-html', 'jasmine-async'], function() {

    for (i in specs) {
        specs[i] = SPEC_PATH + specs[i] + '.spec';
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
