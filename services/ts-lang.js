var fs = require("fs");
var ts = require("typescript");
var source = "let x: string  = 'string'";
var result = ts.transpile(source, { module: 1 /* CommonJS */ });
console.log(JSON.stringify(result));
function watch(rootFileNames, options) {
    var files = {};
    // initialize the list of files
    rootFileNames.forEach(function (fileName) {
        console.log("ts: " + fileName);
        files[fileName] = { version: 0 };
    });
    // Create the language service host to allow the LS to communicate with the host
    var servicesHost = {
        getScriptFileNames: function () { return rootFileNames; },
        getScriptVersion: function (fileName) { return files[fileName] && files[fileName].version.toString(); },
        getScriptSnapshot: function (fileName) {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }
            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: function () { return process.cwd(); },
        getCompilationSettings: function () { return options; },
        getDefaultLibFileName: function (options) { return ts.getDefaultLibFilePath(options); },
    };
    // Create the language service files
    var languageService = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());
    // Now let's watch the files
    rootFileNames.forEach(function (fileName) {
        console.log("Watch file: " + fileName);
        // First time around, emit all files
        emitFile(fileName);
        // Add a watch on the file to handle next change
        // TODO: This will probably involve "compile on save" from our file system instead of file watcher...
        fs.watchFile(fileName, { persistent: true, interval: 250 }, function (curr, prev) {
            // Check timestamp
            if (+curr.mtime <= +prev.mtime) {
                return;
            }
            // Update the version to signal a change in the file
            files[fileName].version++;
            // write the changes to disk
            emitFile(fileName);
        });
    });
    function emitFile(fileName) {
        var output = languageService.getEmitOutput(fileName);
        if (!output.emitSkipped) {
            console.log("Emitting " + fileName);
        }
        else {
            console.log("Emitting " + fileName + " failed");
            logErrors(fileName);
        }
        output.outputFiles.forEach(function (o) {
            fs.writeFileSync(o.name, o.text, "utf8");
        });
    }
    function logErrors(fileName) {
        var allDiagnostics = languageService.getCompilerOptionsDiagnostics()
            .concat(languageService.getSyntacticDiagnostics(fileName))
            .concat(languageService.getSemanticDiagnostics(fileName));
        allDiagnostics.forEach(function (diagnostic) {
            var message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            if (diagnostic.file) {
                var _a = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start), line = _a.line, character = _a.character;
                console.log("  Error " + diagnostic.file.fileName + " (" + (line + 1) + "," + (character + 1) + "): " + message);
            }
            else {
                console.log("  Error: " + message);
            }
        });
    }
    exports.createTsView = function (host, content, document) {
        // function createClassifier(host: Logger): Classifier;
        var lines = content.split("\n");
        var classifier = ts.createClassifier(); // { log: s => console.log("Log: " + s) }
        var finalLexState = 0 /* None */;
        lines.forEach(function (line, index) {
            var result = classifier.getClassificationsForLine(line, finalLexState, true);
            finalLexState = result.finalLexState;
            var lElem = document.createElement("ui-line");
            lElem.setAttribute("num", index);
            host.appendChild(lElem);
            var start = 0;
            result.entries.forEach(function (token) {
                var end = start + token.length;
                var tElem = document.createElement("span");
                tElem.setAttribute("class", ts.TokenClass[token.classification].toLowerCase());
                var tokenText = line.substr(start, token.length);
                // console.log("Line: '" + tokenText + "' " + token.length + " " + (tokenText == "\r"));
                tElem.textContent = tokenText;
                lElem.appendChild(tElem);
                start = end;
            });
        });
    };
}
// Initialize files constituting the program as all .ts files in the current directory
var currentDirectoryFiles = fs.readdirSync(process.cwd()).
    filter(function (fileName) { return fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts"; });
// Start the watcher
watch(currentDirectoryFiles, { module: 1 /* CommonJS */ });
//# sourceMappingURL=ts-lang.js.map