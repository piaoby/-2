const gulp = require('gulp')
const zip = require('gulp-zip')

exports.default = function () {
    return gulp.src([
        './**/*',
        './.*',
        '!./node_modules/**/*'
    ])
        .pipe(zip('custom-component.zip'))
        .pipe(gulp.dest('./'))
}
