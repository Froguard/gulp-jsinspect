const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const gJsinspecty = require('../index.js');

gulp.task('jsinspect', () => {
    let src = [
        './src/*.js'
    ];
    return gulp.src(src)
        .pipe(gJsinspecty())
        .pipe(gulp.dest('./res'));
});