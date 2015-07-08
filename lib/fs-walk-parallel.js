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
		var subdirs = [];

		files.forEach(function(file) {
			var filename = path.join(directory, file);
			fs.stat(filename, function(err2, stat) {
				left--;
				if (err2) {
					finished(err2);
					return;
				}
				iterator(filename, stat);
				if (stat.isDirectory()) {
					subdirs.push(filename);
				}
				if (left === 0) {
					var subdirsLeft = subdirs.length;
					subdirs.forEach(function(subdir) {
						fsWalkParallel(subdir, iterator, function(err3) {
							subdirsLeft--;
							if (err3) {
								finished(err3);
							}
							if (subdirsLeft === 0) {
								finished();
							}
						});
					});
					if (subdirsLeft === 0) {
						finished();
					}
				}
			});
		});

		if (left === 0) {
			finished();
		}
	});
}

module.exports = fsWalkParallel;
