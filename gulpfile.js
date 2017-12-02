/*

Before using make sure you have:
npm install --save-dev gulp gulp-minify-css gulp-concat gulp-uglify gulp-autoprefixer gulp-sass

Make sure to change the directory names in the default watch function to the CSS/SCSS/SASS directories you are using so it reloads
*/
var gulp = require('gulp'),
minifyCSS = require('gulp-minify-css'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
prefix = require('gulp-autoprefixer'),
filter = require('gulp-filter');

var clean = require('gulp-clean');
// sass = require('gulp-sass');

var mainJsFilter = filter(['main.js'], { restore: true });


// Minifies JS
gulp.task('js', function () {
    return gulp.src([
        'app/js/material.min.js',
        'app/js/getmdl-select.min.js',
        'app/js/rome.js',
        'app/js/moment.js',
        'app/js/material-datetime-picker.js',
        'app/js/jquery-3.2.1.min.js',
        'app/js/main.js'
    ])
    // return gulp.src('app/js/**/*.js')
    .pipe(mainJsFilter)
    .pipe(uglify())
    .pipe(mainJsFilter.restore)
    .pipe(concat('build.js'))
    .pipe(clean({ force: true }))
    .pipe(gulp.dest('public/js'))
});

gulp.task('copyImages', function () {
    gulp.src('app/images/**/*')
        .pipe(gulp.dest('public/images/'));
});
gulp.task('copyIndex', function () {
    gulp.src('app/index.html')
        .pipe(gulp.dest('public/'));
});

/*==========  Minify and concat different styles files  ==========*/

var mainCssFilter = filter(['main.css'], { restore: true });

// SASS Version
gulp.task('styles', function () {
    return gulp.src([
        'app/css/css.css',
        'app/css/getmdl-select.min.css',
        'app/css/icon.css',
        'app/css/material-datetime-picker.css',
        'app/css/material.indigo-pink.min.css',
        'app/css/material.min.css',
        'app/css/main.css',
    ])
    // .pipe(sass())
    .pipe(prefix('last 2 versions'))
    .pipe(concat('styles.css'))
    .pipe(minifyCSS())
    // .pipe(clean({ force: true }))
    .pipe(gulp.dest('public/css'))
});

// SCSS Version
//gulp.task('styles', function(){
//return gulp.src('src/scss/**/*.scss')
//.pipe(sass())
//.pipe(prefix('last 2 versions'))
//.pipe(concat('main.css'))
//.pipe(minifyCSS())
//.pipe(gulp.dest('public/css'))
//});


// CSS Version
/*
gulp.task('styles', function(){
    return gulp.src('src/css/*.css')
    .pipe(concat('site.css'))
    .pipe(minifyCSS())
    .pipe(prefix('last 2 versions'))
    .pipe(gulp.dest('public/css'))
});
*/

gulp.task('default', function () {
    gulp.run('styles')
    gulp.run('js')
    gulp.run('copyIndex')
    gulp.run('copyImages')
    gulp.watch('app/css/**/*.css', function () {
        gulp.run('styles')
    })
    gulp.watch('app/js/**/*.css', function () {
        gulp.run('js')
    })
    gulp.watch('app/images/**/*', function () {
        gulp.run('copyImages')
    })
});