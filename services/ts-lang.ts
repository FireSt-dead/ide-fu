import * as fs from "fs";
import * as ts from "typescript";

const source = "let x: string  = 'string'";
let result = ts.transpile(source, { module: ts.ModuleKind.CommonJS });

console.log(JSON.stringify(result));

function watch(rootFileNames: string[], options: ts.CompilerOptions) {
    const files: ts.Map<{ version: number }> = {};

    // initialize the list of files
    rootFileNames.forEach(fileName => {
        console.log("ts: " + fileName);
        files[fileName] = { version: 0 };
    });

    // Create the language service host to allow the LS to communicate with the host
    const servicesHost: ts.LanguageServiceHost = {
        getScriptFileNames: () => rootFileNames,
        getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
        getScriptSnapshot: (fileName) => {
            if (!fs.existsSync(fileName)) {
                return undefined;
            }

            return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
        },
        getCurrentDirectory: () => process.cwd(),
        getCompilationSettings: () => options,
        getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    };

    // Create the language service files
    const languageService = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())

    // Now let's watch the files
    rootFileNames.forEach(fileName => {
		console.log("Watch file: " + fileName);
        // First time around, emit all files
        emitFile(fileName);

        // Add a watch on the file to handle next change
		// TODO: This will probably involve "compile on save" from our file system instead of file watcher...
        fs.watchFile(fileName,
            { persistent: true, interval: 250 },
            (curr, prev) => {
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

    function emitFile(fileName: string) {
        let output = languageService.getEmitOutput(fileName);

        if (!output.emitSkipped) {
            console.log(`Emitting ${fileName}`);
        }
        else {
            console.log(`Emitting ${fileName} failed`);
            logErrors(fileName);
        }

        output.outputFiles.forEach(o => {
            fs.writeFileSync(o.name, o.text, "utf8");
        });
    }

    function logErrors(fileName: string) {
        let allDiagnostics = languageService.getCompilerOptionsDiagnostics()
            .concat(languageService.getSyntacticDiagnostics(fileName))
            .concat(languageService.getSemanticDiagnostics(fileName));

        allDiagnostics.forEach(diagnostic => {
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                console.log(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
            }
            else {
                console.log(`  Error: ${message}`);
            }
        });
    }
    
    exports.createTsView = function(host, content: string, document: any) {
        // function createClassifier(host: Logger): Classifier;
        var lines: string[] = content.split("\n");
        var classifier = ts.createClassifier({ log: s => console.log("Log: " + s) });

        var finalLexState = ts.EndOfLineState.Start;
        lines.forEach((line, index) => {
            var result = classifier.getClassificationsForLine(line, finalLexState, true);
            finalLexState = result.finalLexState;
            
            var lElem = document.createElement("ui-line");
            lElem.setAttribute("num", index);
            host.appendChild(lElem);
            
            var start = 0;
            result.entries.forEach(token => {
                var end = start + token.length;

                var tElem = document.createElement("span");
                tElem.setAttribute("class", ts.TokenClass[token.classification].toLowerCase());
                tElem.textContent = line.substr(start, token.length);
                lElem.appendChild(tElem);
                
                start = end;
            });
        });
    }
}

// Initialize files constituting the program as all .ts files in the current directory
const currentDirectoryFiles = fs.readdirSync(process.cwd()).
    filter(fileName=> fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts");

// Start the watcher
watch(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS });
