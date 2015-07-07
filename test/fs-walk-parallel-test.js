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
	fsWalkParallel("doesntExist", function() {
		throw "should never happen";
	}, function(err) {
		t.ok(err, "should have an error");
		t.end();
	});
});

tap.test("empty folder should return no errors", function(t) {
	setup(t, { "folder": {} });
	fsWalkParallel("folder", function() {
		throw "should never happen";
	}, function(err) {
		t.notOk(err, "should have no errors");
		t.end();
	});
});
