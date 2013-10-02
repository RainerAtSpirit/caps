module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                    '* Copyright (c) 1998, <%= grunt.template.today("yyyy") %> Spirit EDV-Beratung AG \n' +
                    '* Available via the MIT license.\n' +
                    '* see: https://github.com/RainerAtSpirit/caps for details.\n' +
                    '*/\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        requirejs: {
            std: {
                options: {
                    almond: true,
                    optimize: 'none',
                    baseUrl: 'src',
                    paths: {
                        jquery: '../lib/jquery/jquery-1.9.1'
                    },
                    include: ['caps'],
                    exclude: ['jquery'],
                    out: 'build/caps.js',
                    wrap: {
                        startFile: 'src/wrap/wrap.start',
                        endFile: 'src/wrap/wrap.end'
                    }
                }
            }
        },
        jasmine: {
            build: {
                src: 'build/caps.min.js',
                options: {
                    vendor: [
                        'lib/jquery/jquery-1.9.1.js',
                        'test/libs/underscore.js',
                        'test/libs/equivalent-xml.js',
                        'test/libs/jasmine-jquery-1.5.2.js'
                    ],
                    specs: 'test/specs/*spec.build.js',
                    keepRunner: false
                }
            },
            AMD: {
                src: 'src/**/*.js',
                options: {
                    specs: 'test/specs/*spec.js',
                    keepRunner: false,
                    vendor: [
                        'test/libs/underscore.js',
                        'test/libs/equivalent-xml.js',
                        'test/libs/jasmine-jquery-1.5.2.js'
                    ],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: 'src/',
                            paths: {
                                "jquery": "../lib/jquery/jquery-1.9.1"
                            }
                        }
                    }
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-requirejs");

    // Default task(s).
    grunt.registerTask('default', ['jasmine:AMD', 'requirejs', 'uglify', 'jasmine:build']);

};