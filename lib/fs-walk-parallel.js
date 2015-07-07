"use strict";

var fs = require("fs");
var path = require("path");

function fsWalkParallel(directory, iterator, finished) {
	fs.readdir(directory, function(err, files) {
		if (err) {
			finished(err);
			return;
		}

		var left = files.length;

		files.forEach(function(file) {
			var filename = path.join(directory, file);
			fs.stat(filename, function(err2, stat) {
				left--;
				if (err2) {
					finished(err2);
					return;
				}
				iterator(stat);
				if (left === 0) {
					finished();
				}
			});
		});

		if (left === 0) {
			finished();
		}
	});
}

module.exports = fsWalkParallel;
