'use strict';

module.exports = function (grunt) {

  grunt.initConfig({

    // Less task
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

    // Preprocess task
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

    // Jst task
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

    // Uglify task
    uglify: {
      development: {
        options: {
          beautify: true,
          sourceMap: true,
          sourceMapName: 'public/built/js/app.min.map',
        },
        files: {
          'public/built/js/app.min.js': [
            'public/config/**/*.js',
            'public/built/js/jst.js',
            'public/app/app.js',
            'public/app/lib/**/*.js',
            'public/app/entities/**/*.js',
            'public/app/modules/**/*.js'
          ]
        }
      },
      production: {
        files: {
          'public/built/js/app.min.js': [
            'public/config/**/*.js',
            'public/built/js/jst.js',
            'public/app/app.js',
            'public/app/lib/**/*.js',
            'public/app/entities/**/*.js',
            'public/app/modules/**/*.js'
          ]
        }
      }
    },

    // Watch task
    watch: {
      configFiles: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      },
      uglify: {
        files: [
          'public/app/**/*',
          'public/built/js/jst.js'
        ],
        tasks: ['uglify:development'],
        options: {
          spawn: false,
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
          spawn: false,
          livereload: true
        }
      },
      preprocess: {
        files: ['public/_index.ejs'],
        tasks: ['preprocess:development'],
        options: {
          spawn: false,
          livereload: true
        }
      },
      jst: {
        files: ['public/app/templates/**/*.html'],
        tasks: ['jst']
      }
    },

    // Jshint task
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

    // Mocha task
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
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['less:production']);

};
