'use strict';

module.exports = function () {
	$.gulp.task('image', function () {
		return $.gulp.src('./img/images/*')
		.pipe($.gp.image({
			jpegRecompress: false,
			mozjpeg: false,
			svgo: false
			}))
		.pipe($.gulp.dest('./build/img'));
	});
};