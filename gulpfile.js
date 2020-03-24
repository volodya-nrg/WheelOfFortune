var gulp			= require('gulp');
var concat			= require('gulp-concat');
var cssmin			= require('gulp-cssmin');
var uglify			= require('gulp-uglify');
var autoprefixer	= require('gulp-autoprefixer');
var less			= require('gulp-less');
var watch			= require('gulp-watch');
var connect			= require('gulp-connect-php');
var pump			= require('pump');
var browserSync		= require('browser-sync');
var plumber			= require('gulp-plumber');

gulp.task('tLessToCss', function(){
    return gulp.src('./less/*.less')
				.pipe(plumber())
				.pipe(less())
				.pipe(autoprefixer({
					browsers: ['last 5 versions', '> 1%', 'ie 9', 'ie 8', 'ie 7'],
					cascade: true
				}))
				.pipe(cssmin())
				.pipe(concat('all.min.css'))
				.pipe(gulp.dest('./css'))
				.pipe(browserSync.reload({
					stream: true
				}));
});
// gulp.task('tConcatAndMinJs', function(cb){
// 	var data = [
// 					gulp.src('./js/*.js'),
// 					concat('all.min.js'),
// 					uglify(),
// 					gulp.dest('htdocs/app/view/js/dist/'),
// 				];		
// 	pump(data, cb);
// });
gulp.task('tBrowserSync', ['tLessToCss'], function() {
   	connect.server({}, function(){
		browserSync({
			proxy: 'wheel:80',
			browser: 'firefox',
			notify: false,
			minify: false
    	});
	});
	
	gulp.watch('./less/*.less', ['tLessToCss']);
	gulp.watch('./**/*.php').on('change', function(){
		browserSync.reload();
	});
	gulp.watch('./js/**/*.js').on('change', function(){
		browserSync.reload();
	});
});
gulp.task('default', ['tBrowserSync']);