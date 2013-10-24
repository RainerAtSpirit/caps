/*global module, require */
module.exports = function( grunt ) {
    "use strict";
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/specs/**/*.js']
        },
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
                        startFile: 'src/wrap/start.frag',
                        endFile: 'src/wrap/end.frag'
                    }
                }
            }
        },
        jasmine: {
            build: {
                src: 'build/caps.js',
                options: {
                    vendor: [
                        'lib/jquery/jquery-1.9.1.js',
                        'test/_libs/underscore.js',
                        'test/_libs/equivalent-xml.js',
                        'test/_libs/jasmine-jquery-1.5.2.js'
                    ],
                    specs: 'test/buildSpecs/*spec.js',
                    keepRunner: true
                }
            },
            AMD: {
                src: 'src/**/*.js',
                options: {
                    specs: 'test/srcSpecs/**/*spec.js',
                    keepRunner: true,
                    vendor: [
                        'test/_libs/underscore.js',
                        'test/_libs/equivalent-xml.js',
                        'test/_libs/jasmine-jquery-1.5.2.js'
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
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-requirejs");

    // Default task(s).
    grunt.registerTask('build', ['jshint', 'jasmine:AMD', 'requirejs', 'uglify', 'jasmine:build']);
    grunt.registerTask('default', ['jasmine:AMD', 'jasmine:build']);
};
