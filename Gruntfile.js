'use strict';

module.exports = function (grunt) {
    var scripts = ['Gruntfile.js', 'components/**/*.js', 'pages/**/*.js'];
    var styles = ['components/**/*.css', 'pages/**/*.css'];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        lmd: {
            index: 'index',
            release: 'index+release'
        },

        lmdCss: {
            options: {
                restructure: true,
                banner: '',
                report: false
            },
            index: 'index'
        },

        jscs: {
            options: {
                config: '.jscs.json'
            },
            all: scripts
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: scripts
        },

        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: styles
            }
        },

        watch: {
            options: {
                // Start a live reload server on the default port 35729
                // USAGE: <script src="http://localhost:35729/livereload.js"></script>
                livereload: true
            },
            js: {
                files: scripts,
                tasks: ['js']
            },
            css: {
                files: styles,
                tasks: ['css']
            }
        },

        concurrent: {
            build: ['css', 'js']
        }
    });

    // These plugins provide necessary tasks
    grunt.loadTasks('grunt');
    require('load-grunt-tasks')(grunt);

    // Default task
    grunt.registerTask('default', ['concurrent:build', 'watch']);
    grunt.registerTask('lint', ['csslint:all', 'jscs:all', 'jshint:all']);
    grunt.registerTask('css', ['csslint:all', 'lmdCss:index']);
    grunt.registerTask('js', ['jscs:all', 'jshint:all', 'lmd:index']);

    // Release task
    grunt.registerTask('release', ['lint', 'lmd:release', 'lmdCss:index']);
};
