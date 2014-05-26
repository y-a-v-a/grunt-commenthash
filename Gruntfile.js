module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    commenthash: {
      base: {
        dest: 'out/base/',
        src: 'examples/test1.js'
      },
      template: {
        options: {
          template: '<%= grunt.template.today("yyyy-mm-dd") %> - <%= commenthash.value %>'
        },
        dest: 'out/template/',
        src: 'examples/test1.js'
      },
      custom_template: {
        options: {
          template: function(data) {
            if(data.src === 'examples/test1.js') {
              return 'test1 - <%= grunt.template.today("yyyy-mm-dd") %> - <%= commenthash.value %>';
            } else {
              return '<%= grunt.template.today("yyyy-mm-dd") %> - <%= commenthash.value %>';
            }
          }
        },
        expand: true,
        cwd: 'examples/',
        src: '**/*.js',
        dest: 'out/custom_template/'
      }
    },
    watch: {
      files: '<%= jshint.all %>',
      tasks: 'default'
    },
    jshint: {
      all: ['Gruntfile.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    clean: [
      'out/'
    ],
    simplemocha: {
      options: {
        ui: 'tdd',
        reporter: 'Spec'
      },
      all: { src: 'test/**/*.js' }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['clean', 'jshint', 'commenthash', 'simplemocha']);
  grunt.registerTask('dev', ['watch']);


};
