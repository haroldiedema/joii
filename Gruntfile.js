module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        'concat': {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [
                      'src/Compatibility.js',
                      'src/PrototypeBuilder.js',
                      'src/ClassBuilder.js',
                      'src/InterfaceBuilder.js',
                      'src/EnumBuilder.js',
                      'src/Reflection.js',
                      'src/Config.js',
                      'src/joii.js'
                ],
                // the location of the resulting JS file
                dest: './dist/<%= pkg.name %>.js'
            }
        },
        'uglify': {
            options: {
                banner: '/* <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: './dist/<%= pkg.name %>.js',
                dest: './dist/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);
};
