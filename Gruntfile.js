module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                    '* Copyright (c) 1998 - <%= grunt.template.today("yyyy") %> Rainer Wittmann, Spirit EDV-Beratung AG \n' +
                    '*/\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jasmine: {
            caps: {
                src: 'src/*js',
                options: {
                    vendor: [
                        'lib/jquery/jquery-1.9.1.js'
                    ],
                    specs: 'test/specs/*spec.js',
                    keepRunner: false,
                    helpers: [
                        'test/helpers/underscore.js',
                        'test/helpers/equivalent-xml.js',
                        'test/helpers/jasmine-jquery-1.5.2.js'
                    ]
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};