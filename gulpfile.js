/**
 *Created By: Md. Nazmus Salahin
 *Created Date: 10/22/2017
 *Modified By:
 *Modified date:
 *(C) CopyRight Nybsys ltd.
 */

var gulp = require('gulp');
var task = require ('gulp-task');
var nodemon = require('gulp-nodemon');
var jsonTask = require('gulp-run');
var gulpSequence = require('gulp-sequence');
var FileCache = require("gulp-file-cache");

var fileCache = new FileCache();


var paths = {
    pages: ['src/**/*.ts']
};

const ts = require('gulp-typescript');
const clean = require('gulp-rimraf');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

/*

gulp.task("compile", function () {
    console.log("complie ....");
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));

});
*/


gulp.task('start', function () {
    nodemon({
        script: 'dist/index.js'
        , debug: true
        , ignore: ['.idea/*', 'node_modules/*']
        , verbose: true
        , ext: 'js html'
        , env: { 'NODE_ENV': 'development' }
    })
});

/*
gulp.task('watch', ['compile'], function () {
    gulp.watch('src/!**!/!*.ts', ['scripts']);
});
*/

gulp.task('clean', [], function() {
    console.log("Clean all files in build folder");
    return gulp.src("dist", { read: false }).pipe(clean());
});


gulp.task('compile', function(){
    console.info('compile project');
    return jsonTask('npm run tsc').exec()
        .pipe(fileCache.filter())
        .pipe(fileCache.cache());
});



function compileOnChange() {
    console.log('on change compile project');
    return gulp.run('compile');
}

/*function startAndWatch() {
    console.info('start and watch project');
    gulp.run('compile');
    gulp.run('start');
    gulp.run('watch');
    return;
}*/

gulp.task('startAndWatch', gulpSequence('compile', 'start', 'watch'));


/*gulp.task('startAndWatch',['compile','start','watch'],function () {
    //startAndWatch();
});*/




// Loses directory structure (BUG)
gulp.task('watch', function () {
    gulp.watch('src/**/*.ts').on('change', function (file) {
        console.log("on change: " + JSON.stringify(file,null,2));
        compileOnChange();
    });
});



gulp.task('default', ['startAndWatch']);
