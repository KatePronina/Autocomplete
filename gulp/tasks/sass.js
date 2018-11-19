'use strict'

module.exports = function () {
	$.gulp.task('sass', function() {
	return $.gulp.src('./source/style/app.scss')
		.pipe($.gp.sourcemaps.init())
		.pipe($.gp.sass({outputStyle: 'compressed'}))
		.pipe($.gp.autoprefixer({
			browsers: [
				'last 2 version'
			]
		}))
		.pipe($.gp.sourcemaps.write())
		.pipe($.gulp.dest('./build/css'))
	});
}

