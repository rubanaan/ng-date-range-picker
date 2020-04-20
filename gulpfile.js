let gulp = require("gulp");
let gulpClean = require("gulp-clean");

let gulpConcat = require("gulp-concat");
let gulpRename = require("gulp-rename");
let gulpAutoprefixer = require("autoprefixer");

let gulpHtmlMin = require("gulp-htmlmin");
let gulpTemplateCache = require("gulp-angular-templatecache");

let gulpLess = require("gulp-less");
let gulpPostCss = require("gulp-postcss");
let gulpCleanCss = require("gulp-clean-css");

let gulpAnnotate = require("gulp-ng-annotate");
let gulpUglify = require("gulp-uglify");
let gulpReplace = require("gulp-replace");
let gulpBabel = require("gulp-babel");

gulp.task("template", function () {
  return gulp
    .src([
      "app/picker/calender-date.html",
      "app/picker/range-picker.html",
      "app/picker/range-picker-input.html",
    ])
    .pipe(gulpHtmlMin({ collapseWhitespace: true }))
    .pipe(
      gulpTemplateCache({
        filename: "template.js",
        module: "ngDateRangePicker",
        transformUrl: function (url) {
          return "picker/" + url;
        },
      })
    )
    .pipe(gulp.dest("src/"));
});

gulp.task("style", function () {
  return gulp
    .src("app/styles/date_picker.less")
    .pipe(gulpLess())
    .pipe(gulpPostCss([gulpAutoprefixer({ cascade: false })]))
    .pipe(gulpRename("picker.css"))
    .pipe(gulp.dest("src/"));
});
gulp.task("minifyStyle", function () {
  return gulp
    .src("src/picker.css")
    .pipe(gulpCleanCss({ keepSpecialComments: false }))
    .pipe(gulpRename("picker.min.css"))
    .pipe(gulp.dest("src/"));
});

gulp.task("javascript", function () {
  return gulp
    .src([
      "app/picker/js/pickerProvider.js",
      "app/picker/js/pickerService.js",

      "app/picker/js/calendarDateController.js",
      "app/picker/js/calendarDateDirective.js",

      "app/picker/js/rangePickerController.js",
      "app/picker/js/rangePickerDirective.js",

      "app/picker/js/rangePickerInputController.js",
      "app/picker/js/rangePickerInputDirective.js",

      "src/template.js",
    ])
    .pipe(gulpConcat("picker.js"))
    .pipe(
      gulpAnnotate({
        add: true,
        single_quotes: true,
      })
    )
    .pipe(gulpReplace(/["']ngInject["'];*/g, ""))
    .pipe(
      gulpBabel({
        presets: ["@babel/env"],
      })
    )
    .pipe(gulp.dest("src/"));
});
gulp.task("minifyJavascript", function () {
  return gulp
    .src("src/picker.js")
    .pipe(gulpUglify({ mangle: true }))
    .pipe(gulpRename("picker.min.js"))
    .pipe(gulp.dest("src/"));
});

gulp.task("clean", function () {
  return gulp.src("src/*", { read: false, allowEmpty: true }).pipe(gulpClean());
});
gulp.task("cleanTemplate", function () {
  return gulp
    .src("src/template.js", { read: false, allowEmpty: true })
    .pipe(gulpClean());
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    "template",
    "javascript",
    "style",
    "cleanTemplate",
    "minifyJavascript",
    "minifyStyle"
  )
);
