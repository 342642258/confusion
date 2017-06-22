'use strict';

module.exports = function (grunt) {
    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

// Automatically load required Grunt tasks 加载的时间
    require('jit-grunt')(grunt,{
        useminPrepare:'grunt-usemin'
    });

// Define the configuration for all the tasks
    grunt.initConfig({
        //获取json的信息
        pkg: grunt.file.readJSON('package.json'),

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
                //jshint-stylish是一个外部报告器
            },

            all: {
                src: [
                    'Gruntfile.js',
                    'app/scripts/{,*/}*.js'
                ]
            }
        },
        useminPrepare: {
            html: 'app/sidebar.html',
            options: {
                dest: 'dist'
            }
        },
        concat:{
          option:{
              separator:';'
          } ,
            dist:{}
        },
        //压缩
        uglify:{
          dist:{}
        },
        cssmin:{
          dist:{}
        },
        //Filerev文件末尾生成任意20的乱码
        filerev:{
          option:{
              encoding:'utf8',
              algorithm:'md5',
              length:20
          },
            release:{
                files:[{
                    src:[
                        'dist/scripts/*.js',
                        'dist/styles/*.css'
                    ]

                }]
            }
        },
        //usemin用于合成多个css文件和js文件
        usemin:{
          html:['dist/*.html'],
          css:['dist/styles/*.css'],
          options:{
              assetsDirs:['dist','dist/styles']
          }
        },
        copy:{
            dist:{
                cwd:'app',
                src:['**','!styles/**/*.css','!scripts/**/*.js'],
                dest:'dist',
                expand:true
            },
            fonts:{
                files:[
                    {
                        //for bootstrap fonts
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/bootstrap/dist',
                        src: ['fonts/*.*'],
                        dest: 'dist'
                    },
                    {
                        expand:true,
                        dot:true,
                        cwd: 'bower_components/font-awesome',
                        src:['fonts/*.*'],
                        dest:'dist'
                    }
                ]

            }
        },
        //watch和connect的作用是观察html文件的改动，有一点改变，就是reload一次，并打印出时间
        watch:{
          copy:{
              files:['app/**','!app/**/*.css','!app/**/*.js'],
              tasks:['build']
          },
            scripts:{
                files:['app/scripts/app.js'],
                tasks:['build']
            },
            styles:{
                files:['app/styles/mystyles.css'],
                tasks:['build']
            },
            livereload:{
                options:{
                    livereload:'<%= connect.options.livereload %>'
                },
                files:[
                    'app/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect:{
          options:{
              port: '9000',
              hostname:'localhost',
              livereload:35729
          },
            dist:{
                options:{
                    open:true,
                    base:{
                        path:'dist',
                        options:{
                            index:'sidebar.html',
                            maxAge:300000
                        }
                    }
                }
            }
        },
        clean:{
            build:{
                src:['dist/']
            }
        }


    });

    grunt.registerTask('build', [
        'clean',
        'jshint',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'copy',
        'filerev',
        'usemin'
    ]);
    grunt.registerTask('serve',['build','connect:dist','watch']);
    grunt.registerTask('default',['build']);
};