var specs =
    [ 'sample.mocha'
    , 'messagebus.mocha'
    ];

var BASE_PATH = "../modules/",
    SPEC_PATH = "../specs/",
    LIB_PATH = "../lib/";

require.config({
    baseUrl: BASE_PATH,
    paths: {
        'jquery': LIB_PATH + "jquery",
        'require': LIB_PATH + "require",
        'mocha': LIB_PATH + "mocha",
        'chai': LIB_PATH + "chai"
    },
    shim: {
        'mocha': {
            deps: ['jquery']
        }
    }
});

var expect;

require(['require', 'chai', 'mocha'], function(require, chai) {
    expect = chai.expect;
    for (i in specs) {
        specs[i] = SPEC_PATH + specs[i] + '.spec'
    }
    mocha.setup('bdd');
    require(specs, function() {
        mocha.run();
    });
});
