var gulp = require('gulp');
var del = require('del');
var addStream = require('add-stream');
var $ = require('gulp-load-plugins')({ lazy: true });

var config = {
  sassPath: "./src/client/styles",
  bowerDir: "./bower_components",
  clientapp: "./src/client/app",
  temp: "./.tmp/",
  libs: [
    "./bower_components/jquery/dist/jquery.js",
    "./bower_components/bootstrap/dist/js/bootstrap.js",
    "./bower_components/angularjs/angular.js",
    "./bower_components/angular-resource/angular-resource.js",
    "./bower_components/angular-ui/build/angular-ui.js",
    "./bower_components/angular-ui-router/release/angular-ui-router.js",
  ],
  // typescript settings
  ts: {
      clientts: [
          './src/client/**/*.ts'
      ]
      // output: '.tmp'
  },

  /**
   * template cache
   */
  templateCache: {
      file: 'templates.js',
      options: {
          module: 'app.core',
          root: 'app/',
          standAlone: false
      }
  },

};
/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);


//typescript
gulp.task('tsc', function(done) {
    runTSC('src/client', done);
});
function runTSC(directory, done) {
    var tscjs = path.join(process.cwd(), 'node_modules/typescript/lib/tsc.js');
    console.log(tscjs);
    var childProcess = cp.spawn('node', [tscjs, '-p', directory], { cwd: process.cwd() });
    childProcess.stdout.on('data', function (data) {
        // Ticino will read the output
        console.log(data.toString());
    });
    childProcess.stderr.on('data', function (data) {
        // Ticino will read the output
        console.log(data.toString());
    });
    childProcess.on('close', function () {
        done();
    });
}

gulp.task('bower', function() { 
    return $.bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./web/fonts')); 
});

gulp.task('css', function() { 
    return gulp.src(config.sassPath + '/**/*.scss')
         .pipe(
          $.sass({
             outputStyle: 'compressed',
             includePaths: [
                 config.sassPath,
                 config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                 config.bowerDir + '/fontawesome/scss',
             ]
            }) 
          .on("error", $.notify.onError(function (error) {
                return "Error: " + error.message;
           }))
        ) 
         .pipe(gulp.dest('./web/css')); 
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
    console.log('Creating an AngularJS $templateCache');

    return gulp.src(config.clientapp + "/**/*.html")
        //.pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({empty: true}))
        //.pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

function prepareTemplates() {
  return gulp.src(config.clientapp + "/**/*.html")
    //.pipe(minify and preprocess the template html here)
    .pipe($.angularTemplatecache());
}
/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        './web/**/*.js',
        './web/**/*.html'
    );
    clean(files, done);
});
/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    //log('Cleaning: ' + $.util.colors.blue(path));
    console.log("Cleaning: ", path);
    del(path, done);
}

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
    gulp.watch(config.ts.clientts, ['tsc']);
});

gulp.task('scripts', function() {
  return gulp.src('./src/client/app/**/*.js')
    .pipe(addStream.obj(prepareTemplates()))
    .pipe($.concat('app.js'))
    .pipe(gulp.dest('./web/lib'));
});

gulp.task('lib', function() {
  return gulp.src(config.libs)
    .pipe($.concat('lib.js'))
    .pipe(gulp.dest('./web/lib'));
});

gulp.task('dev', ['clean-code', 'icons', 'css', 'scripts', 'lib']);

module.exports = gulp;
