var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var paths = {
    sourceFiles: './**'
};

// setup up node-webkit-builder
var nw = new (require('node-webkit-builder'))({
    buildDir: './webkitbuilds',
    files: paths.sourceFiles,
    platforms: ['win', 'osx', 'linux32', 'linux64']
});

// tasks:

gulp.task('default', ['generate-nw']);

gulp.task('build', function(done) {
    nw.build()
    .then(done)
    .catch(done);
});

gulp.task('generate-nw', function() {
    return gulp.src(paths.sourceFiles, {dot: true})
    .pipe($.zip('app.nw'))
    .pipe(gulp.dest('./'));
});
