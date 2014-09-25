//引入插件
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


require('shelljs/global');
gulp.task('clean',function(){
	rm('-rf', 'dist');
});

gulp.task('uglify', function() {
	gulp.src('src/*.js')
		.pipe(uglify())
		.pipe(rename(function (path) {
			path.extname = ".min.js"
		}))
		.pipe(gulp.dest('dist'))
		.pipe(gulp.dest('./example/www/js'))
});

//运行任务
gulp.task('default', ['clean','uglify']);
