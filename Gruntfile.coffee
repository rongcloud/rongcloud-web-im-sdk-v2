module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    # Task configuration.
    karma:
      unit:
        configFile: 'karma.conf.coffee'

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

    uglify:
      default:
        options:
          sourceMap: true
        src: './dist/RongIMLib.js'
        dest: './dist/RongIMLib.min.js'

    typedoc:
      build:
        options:
          module: 'commonjs'
          out: './docs'
          name: 'RongCloud'
          target: 'es3'
        src: ['./src/**/*.ts']

    clean:
      ts:
        src: [
          './dist/*'
          './dist/.*'
          './dist/*.*'
        ]

  # These plugins provide necessary tasks.
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-karma'
  grunt.loadNpmTasks 'grunt-typedoc'
  grunt.loadNpmTasks 'grunt-typescript'

  # Compile all ts file.
  grunt.registerTask 'compile', [
    'clean:ts'
    'typescript'
    'uglify'
    'typedoc'
  ]
