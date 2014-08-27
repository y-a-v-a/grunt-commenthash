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
          footer: '-= <%= commenthash.value %> =-'
        },
        dest: 'out/template/',
        src: 'examples/test1.js'
      },
      template_function: {
        options: {
          footer: function(data) {
            if(data.src === 'examples/test1.js') {
              return 'test1 - <%= commenthash.value %>';
            } else {
              return true;
            }
          }
        },
        expand: true,
        cwd: 'examples/',
        src: '**/*.js',
        dest: 'out/template_function/'
      },
      banner_footer: {
        dest: 'out/banner_footer/',
        src: 'examples/test1.js',
        options: {
          banner: 'banner: <%= commenthash.value %>',
          footer: true
        }
      },
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
        reporter: 'spec'
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
