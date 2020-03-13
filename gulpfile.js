var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
$.del = require('del')

var options = {
  name: 'app',
  vendor: 'dashboard',
  dist: 'public/dist',
  exclude: ['*', '!_*'],
}

var paths = {
  styles: 'styles/*.scss',
  scripts: [
    'node_modules/babel-polyfill/dist/polyfill.min.js',

    'node_modules/react/dist/react.min.js',
    'node_modules/react-dom/dist/react-dom.min.js',

    'node_modules/redux/dist/redux.min.js',
    'node_modules/redux-thunk/dist/redux-thunk.min.js',

    'node_modules/react-redux/dist/react-redux.min.js',
    'node_modules/react-router/umd/ReactRouter.min.js',
    'node_modules/react-router-redux/dist/ReactRouterRedux.min.js',

    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    'node_modules/underscore/underscore-min.js',
    'node_modules/classnames/index.js',
    'node_modules/js-cookie/src/js.cookie.js',
    'node_modules/noty/js/noty/packaged/jquery.noty.packaged.min.js',
    'node_modules/react-ga/dist/react-ga.min.js',
  ],
}

/* css */

gulp.task('clean:styles', function() {
  return $.del([options.dist + '/css'])
})

gulp.task('styles', ['clean:styles'], function() {
  return gulp
    .src(paths.styles)
    .pipe(
      $.sass({
        precision: 8,
        includePaths: [
          'node_modules/bootstrap-sass/assets/stylesheets/',
          'node_modules/select2/src/scss/',
          'node_modules/slick-carousel/slick/',
          'node_modules/react-select/dist/',
          'node_modules/animate.css/source/',
          'node_modules/',
        ],
      })
    )
    .pipe($.autoprefixer())
    .pipe($.minifyCss())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(options.dist + '/css'))
    .pipe($.livereload())
})

/* js */

gulp.task('clean:scripts', function() {
  return $.del([options.dist + '/js/' + options.vendor + '.min.js'])
})

gulp.task('scripts', ['clean:scripts'], function() {
  return gulp
    .src(paths.scripts)
    .pipe($.concat(options.vendor + '.js'))
    .pipe($.uglify())
    .pipe($.rename({ suffix: '.min' }))
    .pipe(gulp.dest(options.dist + '/js'))
})

gulp.task('watch', function() {
  $.livereload.listen()
  gulp.watch(paths.styles, ['styles'])
  gulp.watch(paths.scripts, ['scripts'])
})

gulp.task('build', ['styles', 'scripts'])

gulp.task('default', ['watch', 'build'])
