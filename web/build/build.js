/**
 * @author Micho García <micho.garcia@geomati.co>
 */
({
    appDir: '../',
    baseUrl: 'modules',
    paths: {
        'text': '../lib/text-2.0.10',
        'jquery': '../lib/jquery-1.10.2',
        'mustache': '../lib/mustache-0.8.0',
        'bootstrap': '../lib/bootstrap-3.0.3',
        'leaflet': '../lib/leaflet-0.6.4',
        'leaflet-label': '../lib/leaflet-label-0.2.2',
        'leaflet-minimap': '../lib/leaflet-minimap',
        'bing': '../lib/leaflet-bing',
        'draw': '../lib/leaflet-draw-0.2.3',
        'ie8.html5shiv': '../lib/html5shiv',
        'ie8.respond': '../lib/respond.min',
        'wysihtml5': '../lib/bootstrap3-wysihtml5-0.2.7.min',
        'wysihtml5-ca': '../lib/bootstrap-wysihtml5.ca-CT',
        'custom': '../lib/custom',
        'core': '../lib/core',
        'jquery-migrate': '../lib/jquery-migrate-1.2.1.min',
        'jquery-maskedinput': '../lib/jquery-maskedinput-1.3.1',
        'jquery-xdomainrequest': '../lib/jquery-xdomainrequest-1.0.1.min',
        'tinycolor': '../lib/tinycolor-0.9.17.min'
    },
    dir: '../dist',
    mainConfigFile: '../config.js',
    optimizeCss: 'standard',
    optimize: 'uglify2',
    modules: [{
        name: 'mcm.browser'
    }]
});
