const { src, dest, watch } = require('gulp')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const cssmin = require('gulp-cssmin')
const header = require('gulp-header')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const size = require('gulp-size')
const package = require('./package.json')

const banner = [
  '/* * * * * * * * * * * * * * * * * * * * *\\ \n',
  ' <%= package.name %> ',
  'v<%= package.version %> \n ',
  '<%= package.description %> \n',
  ' (c) ' +
    new Date().getFullYear() +
    ' <%= package.author.name %> <<%= package.author.email %>> (<%= package.author.url %>) \n',
  ' <%= package.homepage %> \n',
  ' Licensed under ' + ' <%= package.license %> \n',
  '\\* * * * * * * * * * * * * * * * * * * * */',
  '\n',
].join('')

function onError(err) {
  notify.onError({
    title: 'Scss error',
    message: 'Error: <%= error.message %>',
    sound: 'Bottle',
  })(err)
  this.emit('end')
}

function scss() {
  return src('src/**/*.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass())
    .pipe(header(banner, { package: package }))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest('dist/'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(dest('dist/'))
    .pipe(
      notify({
        onLast: true,
        message: 'scss task complete!',
      })
    )
}

exports.watch = () => watch('src/**/*.scss', scss)
exports.default = scss
