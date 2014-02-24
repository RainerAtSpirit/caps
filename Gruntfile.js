/*global module, require */
module.exports = function( grunt ) {
    "use strict";
    // Livereload and connect variables
    var LIVERELOAD_PORT = 35729,
        lrSnippet = require('connect-livereload')({
            port: LIVERELOAD_PORT
        }),
        mountFolder = function( connect, dir ) {
            return connect.static(require('path').resolve(dir));
        };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/*']
        },
        connect: {
            build: {
                options: {
                    port: 9001,
                    hostname: 'localhost',
                    base: 'build'
                }
            },
            dev: {
                options: {
                    port: 8999,
                    hostname: 'localhost',
                    middleware: function( connect ) {
                        return [lrSnippet, mountFolder(connect, '.')];
                    }
                }
            }
        },
        open: {
            dev: {
                path: 'http://localhost:<%= connect.dev.options.port %>/_SpecRunner.html'
            },
            build: {
                path: 'http://localhost:<%= connect.build.options.port %>'
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
                    specs: 'test/specs/app/*spec.js',
                    keepRunner: true
                }
            },
            dev: {
                src: 'src/**/*.js',
                options: {
                    specs: 'test/specs/modules/**/*spec.js',
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
        },
        jshint: {
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*spec.js']
        },
        requirejs: {
            build: {
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
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> \n' +
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

        watch: {
            build: {
                files: ['build/caps.js', 'test/specs/app/**/*spec.js'],
                tasks: ['jasmine:app']
            },
            dev: {
                files: ['Gruntfile.js', 'src/**/*.js', 'test/specs/modules/**/*spec.js'],
                tasks: ['jasmine:dev'],
                options: {
                    livereload: true
                }
            }
        }
    });

    // Load plugin(s)
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-contrib-connect");
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks("grunt-requirejs");

    // Default task(s).
    grunt.registerTask('build', ['jshint', 'jasmine:dev', 'clean', 'requirejs', 'uglify', 'jasmine:build']);
    grunt.registerTask('default', ['jshint','jasmine:dev']);
    grunt.registerTask('test', ['jshint','jasmine:dev', 'connect:dev:livereload', 'open:dev', 'watch:dev']);
};
