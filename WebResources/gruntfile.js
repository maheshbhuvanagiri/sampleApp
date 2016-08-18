/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {

    grunt.initConfig({
        //loading the Node modules
        pkg: grunt.file.readJSON('package.json'),
        bowercopy: {
            options: {
                // Bower components folder will be removed afterwards is set to true
                clean: false
            },
            // Copying the Js scripts
            scripts: {
                options: {
                    destPrefix: 'Core/Framework/scripts/bower'
                },
                files: {
                    // Keys are destinations (prefixed with `options.destPrefix`)
                    // Values are sources (prefixed with `options.srcPrefix`); One source per destination
                    // e.g. 'bower_components/chai/lib/chai.js' will be copied to 'test/js/libs/chai.js'
                    'angular/angular.js': 'angular/angular.js',
                    'angular/angular.min.js': 'angular/angular.min.js',
                    'angular/angular-ui-router.js': 'angular-ui-router/release/angular-ui-router.js',
                    'angular/angular-ui-router.min.js': 'angular-ui-router/release/angular-ui-router.min.js',
                    'angular/angular-sanitize.js': 'angular-sanitize/angular-sanitize.js',
                    'angular/angular-sanitize.min.js': 'angular-sanitize/angular-sanitize.min.js',
                    'angular/angular-sanitize.min.js.map': 'angular-sanitize/angular-sanitize.min.js.map',
                    'jquery.js': 'jquery/jquery.js',
                    'jquery.min.js': 'jquery/jquery.min.js',
                    'jquery.min.map': 'jquery/jquery.min.map',
                    'jquery.blockUI.js': 'blockui/jquery.blockUI.js',
                    'bootstrap.js': 'bootstrap/dist/js/bootstrap.js',
                    'bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
                    'spin.js': 'spin.js/spin.js',
                    'spin.min.js': 'spin.js/spin.min.js',
                    'jquery.spin.js': 'spin.js/jquery.spin.js',
                    'stacktrace.js': 'stacktrace/dist/stacktrace.js',
                    'stacktrace.min.js': 'stacktrace/dist/stacktrace.min.js',
                    'stacktrace.js.map': 'stacktrace/dist/stacktrace.js.map',
                    'toastr.js': 'toastr/toastr.js',
                    'toastr.min.js': 'toastr/toastr.min.js',
                    'toastr.js.map': 'toastr/toastr.js.map'
                }
            },
            // Copying the Css Files
            styles: {
                options: {
                    destPrefix: 'Core/Framework/vendorstyles/bower'
                },
                files: {
                    'bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
                    'bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
                    'fonts': 'bootstrap/dist/fonts'
                },
            }
        }
    });

    // Loading Dependent packages
    grunt.loadNpmTasks('grunt-bowercopy');

    //Registering the default tasks
    grunt.registerTask('default', ['bowercopy']);
};