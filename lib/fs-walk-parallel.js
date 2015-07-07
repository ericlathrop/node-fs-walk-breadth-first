"use strict";

var fs = require("fs");

function fsWalkParallel(path, iterator, finished) {
	fs.readdir(path, function(err) {
		if (err) {
			finished(err);
			return;
		}
		finished();
	});
}

module.exports = fsWalkParallel;
