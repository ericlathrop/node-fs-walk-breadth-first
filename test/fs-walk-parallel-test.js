"use strict";

var fsWalkParallel = require("../lib/fs-walk-parallel");
var mockFs = require("mock-fs");
var test = require("tape");

function setup(t, fakeFs) {
	mockFs.restore();
	mockFs(fakeFs);
}

test("nonexistant folder should return error", function(t) {
	setup(t, {});
	t.plan(1);
	fsWalkParallel("doesntExist", function() {
		throw "should never happen";
	}, function(err) {
		t.ok(err, "should have an error");
		t.end();
	});
});
test("empty folder should return no errors", function(t) {
	setup(t, { "folder": {} });
	t.plan(1);
	fsWalkParallel("folder", function() {
		throw "should never happen";
	}, function(err) {
		t.notOk(err, "should have no errors");
		t.end();
	});
});
test("two files should call iterator twice with stat", function(t) {
	setup(t, { "folder": { "file1": "contents1", "file2": "contents2" } });
	t.plan(3);
	fsWalkParallel("folder", function(stat) {
		t.ok(stat.isFile(), "should return a fs.Stats");
	}, function(err) {
		t.notOk(err, "should have no errors");
		t.end();
	});
});
