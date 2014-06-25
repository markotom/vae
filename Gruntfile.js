'use strict';

module.exports = function (grunt) {

  grunt.initConfig({

    less: {
      options: {
        paths: ['public']
      },
      development: {
        files: {
          'public/built/css/styles.css': 'public/css/styles.less'
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          'public/built/css/styles.css': 'public/css/styles.less'
        }
      }
    },

    preprocess : {
      development: {
        src: 'public/_index.ejs',
        dest: 'public/index.ejs',
        options: {
          context: {
            node_env: 'development'
          }
        }
      },
      production: {
        src: 'public/_index.ejs',
        dest: 'public/index.ejs',
        options: {
          context: {
            node_env: 'production'
          }
        }
      }
    },

    watch: {
      configFiles: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      livereload: {
        files: [
          'public/**/*',
          'server/**/*'
        ],
        options: {
          livereload: true
        }
      },
      jshint: {
        files: [
          '**/*.js',
          '!node_modules/**/*',
          '!public/components/**/*'
        ],
        tasks: ['jshint']
      },
      mocha: {
        files: ['test/**/*.js'],
        tasks: ['mochaTest']
      },
      less: {
        files: ['public/css/**/*.less'],
        tasks: ['less:development'],
        options: {
          spawn: true
        }
      },
      preprocess: {
        files: ['public/_index.ejs'],
        tasks: ['preprocess:development']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '**/*.js',
        '!node_modules/**/*',
        '!public/components/**/*'
      ]
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        clearRequireCache: true
      },
      src: ['test/**/*.js']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.registerTask('build', ['less:production']);

};