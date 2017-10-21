var gulp          = require('gulp'),

    watch         = require('gulp-watch'),
    clean         = require('del'),

    concat        = require('gulp-concat'),
    rename        = require('gulp-rename'),
    addStream     = require('add-stream'),

    uglify        = require('gulp-uglify'),

    less          = require('gulp-less'),
    cleanCSS      = require('gulp-clean-css'),

    htmlmin       = require('gulp-htmlmin'),
    templateCache = require('gulp-angular-templatecache'),

    replaceName   = require('gulp-html-replace');

gulp.task('minify-html', function ()
{
    gulp.src('app/**/*.html').pipe(replaceName({
        'css': ['styles/vendor.min.css', 'styles/picker.min.css'],
        'js': ['scripts/vendor.min.js', 'scripts/script.min.js']
    })).pipe(gulp.dest('dist/'));
});

gulp.task('scripts', function ()
{
    gulp.src([
        'app/picker/js/pickerProvider.js',
        'app/picker/js/pickerService.js',

        'app/picker/js/calendarDateController.js',
        'app/picker/js/calendarDateDirective.js',

        'app/picker/js/rangePickerController.js',
        'app/picker/js/rangePickerDirective.js',

        'app/picker/js/rangePickerInputController.js',
        'app/picker/js/rangePickerInputDirective.js',

        'app/scripts/app.js',
        'app/scripts/controllers/main.js'
        //'app/menu/**/*.js'
    ]).pipe(concat('script.min.js')).pipe(gulp.dest('dist/scripts/'));
});

gulp.task('styles', function ()
{
    gulp.src('app/styles/*.less').pipe(less()).pipe(concat('picker.min.css')).pipe(gulp.dest('dist/styles/'));
});


// build vendor js and styles
gulp.task('vendorJs', function ()
{
    gulp.src([
        'node_modules/angular/angular.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-messages/angular-messages.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/moment/moment.js'
    ]).pipe(uglify()).pipe(concat('vendor.min.js')).pipe(gulp.dest('dist/scripts/'));
});


gulp.task('vendorCss', function ()
{
    gulp.src([
        'node_modules/angular-material/angular-material.css'
    ]).pipe(cleanCSS({
        keepSpecialComments: false
    })).pipe(concat('vendor.min.css')).pipe(gulp.dest('dist/styles/'));
});


// watch task
gulp.task('watch', ['minify-html', 'styles', 'scripts'], function ()
{
    gulp.watch('app/**/*.html', ['minify-html']);
    gulp.watch('app/**/*.js', ['scripts']);
    gulp.watch('app/styles/*.less', ['styles']);
});

// clean task
gulp.task('clean', function ()
{
    return clean(['dist/**/*']);
});


/*
 buid task for distribution
 */
function prepareTemplates ()
{
    return gulp.src([
        'app/picker/calender-date.html',
        'app/picker/range-picker.html',
        'app/picker/range-picker-input.html'
    ])
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache(
        {
            module: 'ngDateRangePicker',
            transformUrl: function (url)
            {
                return 'picker/' + url;
            }
        }));
}


gulp.task('pickerStyle', function ()
{
    gulp.src('app/styles/date_picker.less').pipe(less()).pipe(rename('picker.css')).pipe(gulp.dest('src/'));
});


gulp.task('pickerJs', function ()
{
    gulp.src([
        'app/picker/js/pickerProvider.js',
        'app/picker/js/pickerService.js',

        'app/picker/js/calendarDateController.js',
        'app/picker/js/calendarDateDirective.js',

        'app/picker/js/rangePickerController.js',
        'app/picker/js/rangePickerDirective.js',

        'app/picker/js/rangePickerInputController.js',
        'app/picker/js/rangePickerInputDirective.js',
    ]).pipe(addStream.obj(prepareTemplates())).pipe(concat('picker.js')).pipe(gulp.dest('src/'));
});

gulp.task('cleanSrc', function ()
{
    return clean(['src/']);
});

//Watch task
gulp.task('default', ['clean', 'minify-html', 'vendorCss', 'vendorJs', 'styles', 'scripts', 'watch']);

gulp.task('build', ['cleanSrc', 'pickerJs', 'pickerStyle']);
 
