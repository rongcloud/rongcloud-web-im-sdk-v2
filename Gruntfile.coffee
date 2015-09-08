module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    # Task configuration.
    clean:
      ts:
        src: [
          './dist/*'
          './dist/.*'
          './dist/*.*'
        ]

    concat:
      dist:
        src: './src/**/*.ts'
        dest: './dist/RongIMLib.ts'

    connect:
      server:
        options:
          keepalive: true
          port: 8080
          base: '.'

    uglify:
      default:
        options:
          sourceMap: true
        src: './dist/RongIMLib.js'
        dest: './dist/RongIMLib.min.js'

    watch:
      options:
        spawn: false
        livereload: true
      compile:
        files: 'src/**/*.ts'
        tasks: [
          'clean'
          'concat'
          'typescript'
        ]

    karma:
      unit:
        configFile: 'karma.conf.coffee'

    typedoc:
      build:
        options:
          module: 'commonjs'
          out: './docs'
          name: 'RongCloud'
          target: 'es3'
        src: ['./src/**/*.ts']

    typescript:
      default:
        options:
          module: 'amd'
          noImplicitAny: true
          removeComments: true
          sourceMap: true
          suppressImplicitAnyIndexErrors: false
          target: 'es3'
        src: './src/**/*.ts'
        dest: './dist/RongIMLib.js'

  # These plugins provide necessary tasks.
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-typedoc'
  grunt.loadNpmTasks 'grunt-typescript'

  # Compile all ts file.
  grunt.registerTask 'compile', [
    'clean'
    'typescript'
    'uglify'
    'watch'
  ]
