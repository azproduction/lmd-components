'use strict';

module.exports = function(grunt) {

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

        watch: {
            options: {
                // Start a live reload server on the default port 35729
                // USAGE: <script src="http://localhost:35729/livereload.js"></script>
                livereload: true
            },
            js: {
                files: ['components/**/*.js', 'pages/**/*.js'],
                tasks: ['js']
            },
            css: {
                files: ['components/**/*.css', 'pages/**/*.css'],
                tasks: ['css']
            }
        },

        concurrent: {
            all: ['css', 'js']
        }
    });

    // These plugins provide necessary tasks
    grunt.loadTasks('grunt');
    grunt.loadNpmTasks('grunt-lmd');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    // Default task
    grunt.registerTask('default', ['concurrent:all', 'watch']);
    grunt.registerTask('css', ['lmdCss:index']);
    grunt.registerTask('js', ['lmd:index']);

    // Release task
    grunt.registerTask('release', ['lmd:release', 'lmdCss:index']);

};