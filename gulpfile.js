const { readFileSync } = require('fs');
const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const runSequence = require('run-sequence');
const jshint = require('gulp-jshint');
const rev = require('gulp-rev');
const del = require('del');
const revRewrite = require('gulp-rev-rewrite');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync');
const fileinclude = require('gulp-file-include');

// Development Tasks 
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  })
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('clean:css', function() {
  return del.sync(['dist/assets/css/**/*', '!dist/assets/css/main.css']);
});

gulp.task('clean:js', function() {
  return del.sync(['dist/assets/js/**/*', '!dist/assets/js/main.js']);
});

gulp.task('sass', function() {
  return gulp.src('src/assets/scss/main.scss') // Gets all files ending with .scss in src/assets/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('dist/assets/css')); // Outputs it in the css folder
});

gulp.task('lint', function() {
  return gulp.src([
      'src/assets/js/main.js',
      'src/assets/js/site/**/*.js'
    ])
    .pipe(jshint({
      esversion: 6
    }))
    .pipe(jshint.reporter('default'));
});

gulp.task('transpile', function() {
  return gulp.src('src/assets/js/main.js')
    .pipe(webpack({
      devtool: 'source-map',
      output: {
        filename: 'main.js'
      },
      module: {
        loaders: [{
          loader: 'babel-loader',
          options: {
            presets: [
              [
                require.resolve('@babel/preset-env'), 
                {
                  "targets" : {
                    "browsers": ["last 4 versions", "> 1%", "IE 11", "not dead"]
                  },
                  "useBuiltIns": "entry"
                }
              ]
            ]
          }
        }]
      }
    }))
    .pipe(gulp.dest('dist/assets/js'));
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', {cwd: 'src/assets'}, function() {
    runSequence(
      'clean:css',
      'sass',
      'copy-css', 
      'manifest',
      'html', // copy html so we have original filenames before rewriting
      'rewrite',
      function() {
        browserSync.reload();
      }
    );
  });
  gulp.watch(['js/**/*.js', '!js/lib/**/*'], {cwd: 'src/assets'}, function() {
    runSequence(
      'lint',
      'clean:js',
      'transpile',
      'copy-js', 
      'libs',
      'manifest',
      'html', // copy html so we have original filenames before rewriting
      'rewrite',
      function() {
        browserSync.reload();
      }
    );
  });
  
  gulp.watch(['src/*.html', 'src/views/*.html'], function() {
    runSequence(
      'html',
      'rewrite',
      function() {
        browserSync.reload();
      }
    );
  });

  // watch for asset changes and copy over new files if necessary
  gulp.watch('images/**/*', {cwd: 'src/assets'}, function() {
    runSequence(
      'images',
      function() {
        browserSync.reload();
      }
    );
    
  });

  gulp.watch('fonts/**/*', {cwd: 'src/assets'}, function() {
    runSequence(
      'fonts',
      function() {
        browserSync.reload();
      }
    );
    
  });

  gulp.watch('data/**/*', {cwd: 'src/assets'}, function() {
    runSequence(
      'data',
      function() {
        browserSync.reload();
      }
    );
    
  });

  gulp.watch('videos/**/*', {cwd: 'src/assets'}, function() {
    runSequence(
      'videos',
      function() {
        browserSync.reload();
      }
    );
    
  });

  gulp.watch('lib/**/*', {cwd: 'src/assets/js'}, function() {
    runSequence(
      'libs',
      function() {
        browserSync.reload();
      }
    );
    
  });
});

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
gulp.task('minify-js', function() {
  return gulp.src('dist/assets/js/main.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('minify-css', function() {
  return gulp.src('dist/assets/css/main.css')
    .pipe(cssnano({zindex: false}))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('manifest', function() {
  return gulp.src(['dist/assets/css/main.css', 'dist/assets/js/main.js'], { base: 'dist/assets' })
    .pipe(rev())
    .pipe(gulp.dest('dist/assets'))
    .pipe(rev.manifest('dist/manifest.json', {
      base: 'dist/assets'
    }))
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('rewrite', function() {
  const manifest = readFileSync('dist/manifest.json');

  return gulp.src('dist/*.html')
    .pipe(revRewrite({ manifest }))
    .pipe(gulp.dest('dist'));
});

// Asset Transfer Tasks
// --------------------

// Copying HTML 
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('dist'))
});

// Copying CSS for dev builds 
gulp.task('copy-css', function() {
  return gulp.src('dist/assets/css/main.css')
    .pipe(gulp.dest('dist/assets/css'));
});

// Copying JS for dev builds 
gulp.task('copy-js', function() {
  return gulp.src('dist/assets/js/main.js')
    .pipe(gulp.dest('dist/assets/js'));
});

// Copying Images 
gulp.task('images', function() {
  return gulp.src('src/assets/images/**/*.+(png|jpg|jpeg|gif|svg)')
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

// Copying sounds
gulp.task('audio', function() {
  return gulp.src('src/assets/audio/**/*')
    .pipe(gulp.dest('dist/assets/audio'))
})

// Copying javascript libraries 
gulp.task('libs', function() {
  return gulp.src('src/assets/js/lib/**/*')
    .pipe(gulp.dest('dist/assets/js/lib'))
})

// Build Sequences
// ---------------

gulp.task('default', function(callback) {
  runSequence('build-dev', 'browserSync', 'watch',
    callback
  )
});

gulp.task('build-dev', function(callback) {
  runSequence(
    'clean',
    'sass',
    'lint',
    'transpile',
    'copy-css', 
    'copy-js',
    ['html', 'libs', 'images', 'fonts', 'data', 'videos', 'audio'],
    'manifest',
    'rewrite',
    callback
  )
});

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    'sass',
    'lint',
    'transpile',
    'minify-css', 
    'minify-js',
    ['html', 'libs', 'images', 'fonts', 'data', 'videos', 'audio'],
    'manifest',
    'rewrite',
    callback
  )
});