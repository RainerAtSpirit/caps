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
                src: 'build/caps.js',
                options: {
                    vendor: [
                        'lib/jquery/jquery-1.9.1.js',
                        'test/libs/underscore.js',
                        'test/libs/equivalent-xml.js',
                        'test/libs/jasmine-jquery-1.5.2.js'
                    ],
                    specs: 'test/specs/*spec.build.js',
                    keepRunner: true
                }
            },
            AMD: {
                src: 'src/**/*.js',
                options: {
                    specs: 'test/specs/*spec.js',
                    keepRunner: true,
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
    grunt.registerTask('default', ['uglify']);
    grunt.registerTask('build', ['requirejs', 'uglify', 'jasmine:build']);

};