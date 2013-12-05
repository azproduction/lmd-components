/**
 * Плагин собирает все CSS, которые лежат рядом с модулями, которые входят в данную сборку
 * @param grunt
 */
module.exports = function (grunt) {
    'use strict';

    var LmdBuilder = require('lmd'),
        csso = require('csso'),
        path = require('path'),
        fs = require('fs'),
        helper = require('grunt-lib-contrib').init(grunt),
        getModuleFileByShortName = require('lmd/lib/lmd_common').getModuleFileByShortName;

    grunt.registerMultiTask('lmdCss', 'Collects css files from lmd modules.', function () {
        // Defaults
        var data = typeof this.data !== 'string' ? this.data : {
            build: this.data
        };

        // Default options
        var options = this.options({
            restructure: true,
            banner: '',
            report: false
        });

        // Configure banner
        var banner = grunt.template.process(options.banner);

        // Lmd options
        var lmdOptions = data.options || {},
            // used for output and css
            distMask = data.distMask || '*.css', // dist/index.js -> dist/index.css
            srcMask = data.srcMask || '*.css',// blocks/block/index.js <- blocks/block/index.css
            lmdDir = path.join(data.projectRoot || process.cwd(), '.lmd'),
            mixinBuilds = data.build;

        // Configure mixins
        if (mixinBuilds) {
            mixinBuilds = mixinBuilds.split('+');
            var buildName = mixinBuilds.shift();
        }

        mixinBuilds = mixinBuilds.map(function (build) {
            return getModuleFileByShortName(lmdDir, build);
        });

        if (mixinBuilds.length) {
            lmdOptions.mixins = mixinBuilds;
        }

        // Create full path + compile .lmd.json
        var lmdFile = path.join(lmdDir, getModuleFileByShortName(lmdDir, buildName)),
            buildConfig = new LmdBuilder(lmdFile, lmdOptions).buildConfig,
            modules = buildConfig.modules,
            cssOutput = applyTemplate(path.join(lmdDir, buildConfig.root || '', buildConfig.output), distMask);

        // File all modules
        var fullCss = Object.keys(modules)
            // Translate js paths to css
            .map(function (name) {
                // index.js + *.css = index.css
                return applyTemplate(modules[name].path, srcMask);
            })
            // Load only exists files
            .filter(function (file) {
                return grunt.file.exists(file);
            })
            .map(grunt.file.read)
            // Concat css files
            .join(grunt.util.normalizelf(grunt.util.linefeed));

        // Minimize css
        var minimizedCss = processCSSO(fullCss, options.restructure);

        if (minimizedCss.length < 1) {
            grunt.log.warn('Destination not written because minified CSS was empty.');
        } else {
            // Add banner.
            minimizedCss = banner + minimizedCss;

            // Write out
            grunt.file.write(cssOutput, minimizedCss);
            grunt.log.writeln('File ' + String(cssOutput).green + ' created.');
            if (options.report) {
                helper.minMaxInfo(minimizedCss, fullCss, options.report);
            }
        }
    });

    // Helper
    // ==========================================================================

    var applyTemplate = function (src, tpl) {
        return tpl.replace('*', src.replace(/\.[^.]+$/, ''));
    };

    /**
     * Process CSSO minification
     * @param {String} src
     * @param {Boolean} isOpt
     */
    var processCSSO = function (src, isOpt) {
        var min;
        if (isOpt) {
            min = csso.justDoIt(src);
        } else {
            min = csso.justDoIt(src, true);
        }
        return min;
    };

};
