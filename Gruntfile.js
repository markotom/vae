'use strict';

module.exports = function (grunt) {

  grunt.initConfig({

    less: {
      options: {
        paths: ['public']
      },
      development: {
        files: {
          'public/built/css/styles.css': 'public/styles/styles.less'
        }
      },
      production: {
        options: {
          cleancss: true
        },
        files: {
          'public/built/css/styles.css': 'public/styles/styles.less'
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

    jst: {
      compile: {
        options: {
          processName: function (filename) {
            filename = filename.match(/templates\/(.*)\.html/);
            return filename[1];
          }
        },
        files: {
          'public/built/js/jst.js': ['public/app/templates/**/*.html']
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
          '!public/components/**/*',
          '!public/built/js/**/*'
        ],
        tasks: ['jshint']
      },
      mocha: {
        files: ['test/**/*.js'],
        tasks: ['mochaTest']
      },
      less: {
        files: ['public/styles/**/*.less'],
        tasks: ['less:development'],
        options: {
          spawn: true
        }
      },
      preprocess: {
        files: ['public/_index.ejs'],
        tasks: ['preprocess:development']
      },
      jst: {
        files: ['public/app/templates/**/*.html'],
        tasks: ['jst']
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        '**/*.js',
        '!node_modules/**/*',
        '!public/components/**/*',
        '!public/built/js/**/*'
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
  grunt.loadNpmTasks('grunt-contrib-jst');

  grunt.registerTask('build', ['less:production']);

};