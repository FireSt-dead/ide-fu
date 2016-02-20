#! /usr/bin/env node
var spawn = require('child_process').spawn;
var path = require('path');

var idefuPath = path.join(__dirname, "..");
var workspacePath = process.cwd();
if (process.argv.length >= 3) {
    workspacePath = path.resolve(process.argv[2]);
}

console.log("Starting IDE-FU: " + idefuPath)
console.log("workspace: " + workspacePath);

var idefuProc = spawn("node", [path.join(idefuPath, "node_modules", "nw", "bin", "nw"), idefuPath, workspacePath], {
    detached: true,
    stdio: 'ignore'
});
idefuProc.unref();