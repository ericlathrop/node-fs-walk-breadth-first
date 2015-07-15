"use strict";

var async = require("async");
var fs = require("fs");
var path = require("path");
var R = require("ramda");

var pathJoin = R.curryN(2, path.join);

var isDirectory = R.pipe(R.lensIndex(1), R.invoker(0, "isDirectory"));

function walk(directory, iterator, finished) {
	var walker = R.curry(walk)(R.__, iterator, R.__); // eslint-disable-line no-underscore-dangle

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
			async.each(pairs, function(pair, callback) {
				pair.push(callback);
				R.apply(iterator, pair);
			}, function() {
				var dirs = R.map(R.lensIndex(0), R.filter(isDirectory, pairs));
				async.each(dirs, walker, finished);
			});
		});
	});
}

module.exports = walk;
