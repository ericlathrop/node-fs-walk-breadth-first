# node-fs-walk-breadth-first
Call a function on each file in a filesystem tree

# Example

```
var walk = require("fs-walk-breadth-first");
walk(".", function(filename, stats) {
	console.log(filename, stats.isDirectory());
}, function(err) {
	if (err) {
		console.error(err);
		return;
	}
	console.log("finished!");
});
```

# Installation

```
npm install --save fs-walk-breadth-first
```

# walk(directory, iterator, callback)

Traverses all files and directories beneath `directory` in [breadth-first](https://en.wikipedia.org/wiki/Breadth-first_search) order. The `iterator` function is called on each file or directory, and the `callback` function is called after all files and directories have been visited.

## Arguments

* `directory` - The directory to traverse.
* `iterator(filename, stats)` - A function to apply to each file or directory found. `stats` is an instance of [fs.Stats](https://nodejs.org/api/fs.html#fs_class_fs_stats).
* `callback(err)` - A function that is called when all the files and directories have been visited, or when an error occurs.

# Code of Conduct
Please note that this project is released with a [Contributor Code of Conduct](https://github.com/ericlathrop/node-fs-walk-breadth-first/blob/master/CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.
