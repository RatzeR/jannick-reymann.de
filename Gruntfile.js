'use strict';
/*jshint camelcase: false*/

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */\n',

    // Project settings
    conf: {
      src: 'src/',
      dist: 'dist/',
      vendor: {
        css: [
//          'vendor/normalize-css/normalize.css'
        ],
        js: [
//          'vendor/jquery/jquery.js',
//          'vendor/picturefill/dist/picturefill.js',
//          'vendor/owl.carousel/dist/owl.carousel.js'
        ]
      }
    },

    clean: {
      assets: [
        '<%= conf.dist %>/assets/css',
        '<%= conf.dist %>/assets/js',
        '<%= conf.dist %>/assets/fonts',
        '<%= conf.dist %>/assets/img'
      ]
    },

    copy: {
      images: {
        expand: true,
        cwd: '<%= conf.src %>/img/',
        src: ['**'],
        dest: '<%= conf.dist %>/img/'
      },
      fonts: {
        expand: true,
        cwd: '<%= conf.src %>/fonts/',
        src: ['**'],
        dest: '<%= conf.dist %>/fonts/'
      },
    },

    sass: {
      build: {
        options: {
          outputStyle: 'compressed',
          sourceComments: 'none',
          sourceMap: 'sass'
        },
        files: {
          '<%= conf.dist %>/assets/css/main.css': '<%= conf.src %>/scss/main.scss',
        }
      },
    },

    /**
     * Merging files
     */
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= banner %>'
      },
      css: {
        src: [
          '<%= conf.vendor.css %>',
          '<%= conf.dist %>/assets/css/main.css'
        ],
        dest: '<%= conf.dist %>/assets/css/main.css'
      },
      js: {
        src: [
          '<%= conf.vendor.js %>',
          '<%= conf.src %>/js/**/*.js',

        ],
        dest: '<%= conf.dist %>/assets/js/main.js'
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: '<%= conf.dist %>/assets/css/',
        src: ['*.css', '!*.min.css'],
        dest: '<%= conf.dist %>/assets/css/'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: false
      },
      js: {
        files: {
          '<%= conf.dist %>/assets/js/main.js': ['<%= conf.dist %>/assets/js/main.js']
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 9'],
        cascade: false,
        map: false,
        silent: false
      },
      dist: {
        expand: true,
        flatten: true,
        src: '<%= conf.dist %>/assets/css/*.css',
        dest: '<%= conf.dist %>/assets/css/'
      },
    },
    /**
     * Open Repository README in the system default browser
     * as a reference to the help section.
     *
     * $ grunt help
     */
    open: {
      help: {
        path: function () {
          var pkgConfig   = grunt.config.get('pkg');

          if(typeof pkgConfig.homepage !== 'undefined') {
            return pkgConfig.homepage + '#readme';
          } else {
            return '../README.md';
          }
        }
      }
    },

    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= conf.src %>/scss/**/*.scss'],
        tasks: ['sass', 'concat:css', 'autoprefixer']
      },
      js: {
        files: ['<%= conf.src %>/app/**/*.js'],
        tasks: ['jshint:js', 'concat:js']
      },
      images: {
        files: ['<%= conf.src %>/assets/**/*.{png,jpg,gif,webp}'],
        tasks: ['copy:images']
      }
 //     templates: {
 //       files: [
 //         '<%= conf.src %>/data/*.json',
 //         '<%= conf.templates %>/**/*.mustache'
 //       ],
 //       tasks: ['mustache_render']
 //     }
    },

    browserSync: {
      dev: {
        bsFiles: {
          src: [
            '<%= conf.dist %>/assets/css/*.css',
            '<%= conf.dist %>/assets/js/*.js',
            '<%= conf.dist %>/**/*.html'
          ]
        },
        options: {
          watchTask: true,
          notify: true,
          server: {
            baseDir: '<%= conf.dist %>'
          },
          ghostMode: {
            clicks: true,
            scroll: true,
            links: true,
            forms: true
          }
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      gruntfile: ['Gruntfile.js'],
      js: [
        '<%= conf.src %>/app/**/*.js',
        '!<%= conf.src %>/app/webtrekk_v3.js'
      ]
    },

    bump: {
      options: {
        bump: true,
        file: 'package.json',
        add: true,
        commit: true,
        tag: true,
        push: true,
        pushTags: true,
        npm: false,
        tagName: 'v<%= version %>',
        commitMessage: 'Release <%= version %>',
        tagMessage: 'Version <%= version %>'
      }
    }
  });

  grunt.task.renameTask('release', 'bump');

  // Default task.
  grunt.registerTask('default', function () {
    grunt.task.run([
//      'jshint',
      'clean',
      'copy',
      'sass',
      'concat',
      'autoprefixer',
      'cssmin',
      'uglify'
    ]);

    grunt.log.writeln('Run `grunt serve` to open the project in your browser.');
  });

  grunt.registerTask('serve', [
    'default',
    'browserSync',
    'watch'
  ]);

  grunt.registerTask('help', [
    'open:help'
  ]);

  grunt.registerTask('release', function () {
    grunt.task.run([
      'default',
      'bump'
    ]);
  });
};

