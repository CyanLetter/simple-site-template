var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'src'
    }
  })
});

gulp.task('sass', function() {
  return gulp.src('src/assets/scss/**/*.scss') // Gets all files ending with .scss in src/assets/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('src/assets/css')) // Outputs it in the css folder
    .pipe(browserSync.reload({ // Reloading with Browser Sync
      stream: true
    }));
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/assets/scss/**/*.scss', ['sass']);
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/assets/js/**/*.js', function() {
    // only lint root files, not libs
    gulp.src('src/assets/js/*.js')
      gulp.start('lint');
      browserSync.reload();
  });
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('useref', function() {

  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano({zindex: false})))
    .pipe(gulp.dest('dist'));
});

// Optimizing Images 
gulp.task('images', function() {
  return gulp.src('src/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/assets/images'))
});

// Copying fonts 
gulp.task('fonts', function() {
  return gulp.src('src/assets/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'))
});

// Copying data 
gulp.task('data', function() {
  return gulp.src('src/assets/data/**/*')
    .pipe(gulp.dest('dist/assets/data'))
})

// Copying videos 
gulp.task('videos', function() {
  return gulp.src('src/assets/videos/**/*')
    .pipe(gulp.dest('dist/assets/videos'))
})

// Copying javascript libraries 
gulp.task('libs', function() {
  return gulp.src('src/assets/js/lib/**/*')
    .pipe(gulp.dest('dist/assets/js/lib'))
})

gulp.task('lint', function() {
  return gulp.src('src/assets/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Cleaning 
gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb);
  });
});

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/assets/images', '!dist/assets/images/**/*']);
});

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence(['sass', 'lint', 'browserSync'], 'watch',
    callback
  )
});

gulp.task('build', function(callback) {
  runSequence(
    'clean:dist',
    'sass',
    'lint',
    ['useref', 'libs', 'images', 'fonts', 'data', 'videos'],
    callback
  )
});
