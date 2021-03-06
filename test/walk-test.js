"use strict";

var walk = require("../lib/walk");
var mockFs = require("mock-fs");
var test = require("tape-catch");

function setup(t, fakeFs) {
	mockFs.restore();
	mockFs(fakeFs);
}

test("nonexistant folder should return error", function(t) {
	setup(t, {});
	t.plan(1);
	walk("doesntExist", function() {
		throw "should never happen";
	}, function(err) {
		t.ok(err, "should have an error");
		t.end();
	});
});
test("empty folder should return no errors", function(t) {
	setup(t, { "folder": {} });
	t.plan(1);
	walk("folder", function() {
		throw "should never happen";
	}, function(err) {
		t.notOk(err, "should have no errors");
		t.end();
	});
});
test("one file should call iterator once with path", function(t) {
	setup(t, { "folder": { "file": "contents" } });
	t.plan(2);
	walk("folder", function(filename, _, callback) {
		t.equal(filename, "folder/file", "should return the file's path");
		callback();
	}, function(err) {
		t.notOk(err, "should have no errors");
		t.end();
	});
});
test("two files should call iterator twice with stat", function(t) {
	setup(t, { "folder": { "file1": "contents1", "file2": "contents2" } });
	t.plan(3);
	walk("folder", function(filename, stat, callback) {
		t.equal(stat.isFile(), true, "should return a fs.Stats");
		callback();
	}, function(err) {
		t.notOk(err, "should have no errors");
		t.end();
	});
});
test("a nested file should call iterator", function(t) {
	setup(t, { "folder1": { "folder2": { "file": "contents" } } });
	t.plan(2);
	walk("folder1", function(filename, stat, callback) {
		if (filename === "folder1/folder2/file") {
			t.ok(stat.isFile(), "should return a fs.Stats");
		}
		callback();
	}, function(err) {
		t.notOk(err, "should have no errors");
		t.end();
	});
});
