var gulp = require('gulp')

var concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    browserSync     = require('browser-sync').create()
var paths = {
    source: './source',
    public: './public',
    style: './source/style',
    script: './source/script',
    css: './public/css',
    js: './public/js',
    vendor: './public/vendor'
}
gulp.task('styles', function() {
    return gulp.src([
            paths.vendor + '/bootstrap/dist/css/bootstrap.css',
            paths.vendor + '/font-awesome/css/font-awesome.css',
            paths.vendor + '/slick-carousel/slick/slick.css',
            paths.vendor + '/slick-carousel/slick/slick-theme.css',
            paths.style + '/*.scss'
        ])
        .pipe(sass({
            outputStyle: 'expanded',
            indentType: 'space',
            indentWidth: 4
        }))
        .pipe(autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.css))
        .pipe(rename('style.min.css'))
        .pipe(cssnano({ zindex: false }))
        .pipe(gulp.dest(paths.css))
})
gulp.task('scripts', function() {
    return gulp.src([
            paths.vendor + '/jQuery/dist/jquery.min.js',
            paths.vendor + '/popper.js/dist/umd/popper.js',
            paths.vendor + '/bootstrap/dist/js/bootstrap.js',
            paths.vendor + '/slick-carousel/slick/slick.js',
            paths.script + '/*.js'
        ])
        .pipe(concat('main.js'))
        .pipe(gulp.dest(paths.js))
        .pipe(rename('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.js))
})
gulp.task('htmlinclude', function() {
    gulp.src([
            paths.source + '/*.html',
            paths.source + '/*/*.html'
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.public))
})
gulp.task('watch',['scripts', 'htmlinclude', 'styles'], function() {
    browserSync.init({
        server: "./public",
        notify: false
    })
    gulp.watch(paths.script + '/*.js', ['scripts'])
    gulp.watch([paths.source + '/*.html', paths.source + '/*/*.html'], ['htmlinclude'])
    gulp.watch([paths.style + '/*.scss', paths.style + '/*/*.scss'], ['styles'])
    gulp.watch([
        paths.public + '/*.html',
        paths.css + '/*.css',
        paths.js + '/*.js'
    ]).on('change', browserSync.reload)
})
gulp.task('default', ['styles', 'scripts', 'htmlinclude'])