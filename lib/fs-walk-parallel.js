"use strict";

var async = require("async");
var fs = require("fs");
var path = require("path");
var R = require("ramda");

var pathJoin = R.curryN(2, path.join);

function fsWalkParallel(directory, iterator, finished) {
	fs.readdir(directory, function(err, files) {
		if (err) {
			finished(err);
			return;
		}

		files = R.map(pathJoin(directory), files);
		async.map(files, fs.stat, function(err2, stats) {
			if (err2) {
				finished(err2);
				return;
			}
			var pairs = R.zip(files, stats);
			R.forEach(R.apply(iterator), pairs);
			var isDirectory = R.pipe(R.lensIndex(1), R.invoker(0, "isDirectory"));
			var dirs = R.map(R.lensIndex(0), R.filter(isDirectory, pairs));
			async.each(dirs, function(dir, callback) {
				fsWalkParallel(dir, iterator, callback);
			}, finished);
		});
	});
}

module.exports = fsWalkParallel;
