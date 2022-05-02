module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                expand: true,
                cwd: 'server/',
                src: ['**/*.js'],
                dest: 'dist/'
            }
        },
        copy: {
            copy_sql: {
                expand: true,
                cwd: 'server',
                src: ['**/*.sql'],
                dest: 'dist/'
            }
        },
        run: {
            options: {},
            frontend_build: {
                exec: 'npm run build --prefix client'
            }
        },
        compress: {
            release_zip: {
                options: {
                    archive: 'releases/<%= pkg.name %>-<%= grunt.template.today("yyyymmdd-HHMMss") %>.zip'
                },
                files: [
                    { src: ['dist/**'] }, // includes files in path
                    { src: ['client/dist/**'] }, // includes files in path and its subdirs
                    { src: ['package.json', 'package-lock.json'] },
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'copy:copy_sql', 'run:frontend_build', 'compress:release_zip']);
};