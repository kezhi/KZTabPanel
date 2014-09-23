//引入插件
var gulp = require('gulp');
var connect = require('gulp-connect');

//创建watch任务去检测文件的改动
gulp.task('watch', function () {
    gulp.watch(['./www/*.html'], ['html']);
	gulp.watch(['./www/css/*.css'], ['css']);
	gulp.watch(['./www/js/*.js'], ['js']);
});
/*gulp.task('watch', function () {
	gulp.watch(['./www/css*//*.css'], ['css']);
});
 gulp.task('watch', function () {
	gulp.watch(['./www/js*//*.js'], ['js']);
});*/
//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: 'www',
        livereload: true
    });
});
//调用要执行的任务
gulp.task('html', function () {
    gulp.src('./www/*.html').pipe(connect.reload());
});
gulp.task('css', function () {
	gulp.src('./www/css/*.css').pipe(connect.reload());
});
gulp.task('js', function () {
	gulp.src('./www/js/*.js').pipe(connect.reload());
});

//运行任务
gulp.task('default', ['connect', 'watch']);
