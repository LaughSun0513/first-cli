const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cssmin = require('gulp-cssmin');
const rename = require("gulp-rename");

gulp.task('js',()=>{
    return gulp
    .src(['./src/js/**/*.js'])
    .pipe(babel({
        presets:['@babel/env']
    }))
    // .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./build/js'))
});

gulp.task('style',()=>{
    return gulp
    .src(['./src/css/**/*.css'])
    .pipe(concat('bundle.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./build/css'))
});

//gulp3 
//gulp.task('default',['js']);

//gulp4 默认依赖任务 写法
gulp.task('default',gulp.series('js','style')); //gulp4 不再像gulp3一样 要使用 gulp.series
