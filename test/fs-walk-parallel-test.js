"use strict";

var fsWalkParallel = require("../lib/fs-walk-parallel");
var mockFs = require("mock-fs");
var tap = require("tap");

function setup(t, fs) {
	t.tearDown(mockFs.restore.bind(mockFs));
	mockFs(fs);
	t.plan(1);
}

tap.test("nonexistant folder should return error", function(t) {
	setup(t, {});
	fsWalkParallel("/doesntExist", function() {
		throw "should never happen";
	}, function(err) {
		t.ok(err, "should have an error");
		t.end();
	});
});
