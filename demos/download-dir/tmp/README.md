# gulp的学习过程

### gulp的安装

`npm i gulp -g` 全局安装

`npm i gulp gulp-babel gulp-concat gulp-uglify -D` 本地安装

`npm i @babel/core @babel/preset-env -D` 安装babel核心库 & 预设

### 配置gulpfile.js && 压缩js
```
const gulp = require('gulp');
const babel = require('gulp-babel'); //解析ES6语法
const concat = require('gulp-concat'); //压缩合并生成的文件名字
const uglify = require('gulp-uglify'); //压缩

gulp.task('js',()=>{
    return gulp
    .src(['./src/js/**/*.js'])   //表示js下面所有的js文件
    .pipe(babel({                //解析ES6
        presets:['@babel/env']
    }))
    .pipe(concat('bundle.js'))  //最终生成的文件名字
    .pipe(uglify())             //代码压缩
    .pipe(rename({suffix: '.min'})) //将最终的js文件变为 xx.min.js
    .pipe(gulp.dest('./build/js')) //压缩指定的目录
});
//gulp3 
//gulp.task('default',['js']);

//gulp4 默认依赖任务 写法
gulp.task('default',gulp.series('js')); //gulp4 不再像gulp3一样 要使用 gulp.series
```

### 压缩css
`npm i gulp-cssmin -D`

```
const gulp = require('gulp');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');

gulp.task('style',()=>{
    return gulp
    .src(['./src/css/**/*.css'])
    .pipe(concat('bundle.min.css'))
    .pipe(cssmin()) //压缩css
    .pipe(gulp.dest('./build/css'))
});
gulp.task('default',gulp.series('style'));
```

### 预期压出来的js 为1.min.js 2.min.js 或 1.css 2.css(即源文件叫什么名字，压缩出来就是什么)
注释 // .pipe(concat('bundle.js'))
添加上 .pipe(rename({suffix: '.min'}))
