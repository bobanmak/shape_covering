const gulp = require('gulp');
const build_as_amd    = require("./build/build_app_amd");
const build_as_module = require('./build/build_app_module');

gulp.task('init', ( done ) => {
    
    done();
    
});

gulp.task("build", ( done ) => {
    "use strict";
    build_as_amd( ()=>{
        build_as_module( ()=>{
            done();
        });
    });
});

gulp.task("buildAMD", build_as_amd );
gulp.task('buildES', build_as_module );

gulp.task('default', gulp.series('init', 'buildAMD', 'buildES') );