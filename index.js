var fs = require("fs");
var path = require("path");
require("./ui/core");
function linkUIComponent(path) {
    var link = document.createElement('link');
    link.rel = 'import';
    link.href = path + '.html';
    link.onerror = function (e) { return console.log("UI link error: " + e); };
    document.head.appendChild(link);
}
linkUIComponent("ui/window/ui-window");
linkUIComponent("ui/buttons/ui-buttons");
linkUIComponent("ui/tab/ui-tab");
linkUIComponent("ui/tree/ui-tree");
linkUIComponent("ui/code/ui-code");
/**
 * Register the class as custom web element.
 */
function component(name) {
    return function (target) {
        document.registerElement(name, { prototype: target.prototype });
        return target;
    };
}
// UI
function parentOfType(node, type) {
    var element = node;
    while (element && !(element instanceof type)) {
        element = element.parentNode;
    }
    return element;
}
var gui = require('nw.gui');
console.log("Args: " + gui.App.argv);
var projectPath;
if (gui.App.argv.length >= 1) {
    projectPath = path.resolve(gui.App.argv[0]);
}
else {
    projectPath = process.cwd();
}
var tsserv = require("./services/ts-lang");
function loadProject(p) {
    try {
        var txt = "";
        var traverse = function (basePath) {
            try {
                fs.readdirSync(basePath).forEach(function (file) {
                    var currentPath = path.resolve(basePath, file);
                    txt += "<ui-node title=\"" + file + "\" file=\"" + currentPath + "\"";
                    if (fs.statSync(currentPath).isDirectory()) {
                        txt += " collapsed=\"true\">";
                        traverse(currentPath);
                    }
                    else {
                        txt += " extension=\"" + path.extname(file) + "\"";
                        txt += ">";
                    }
                    txt += "</ui-node>";
                });
            }
            catch (e) {
            }
        };
        traverse(p);
        setTimeout(function () {
            document.getElementById("proj").innerHTML = txt;
        }, 1);
    }
    catch (e) {
        alert(e.toString());
    }
}
loadProject(projectPath);
window.ondragover = function (e) { e.preventDefault(); return false; };
window.ondrop = function (e) { e.preventDefault(); return false; };
document.addEventListener("DOMContentLoaded", function (e) {
    // alert("Load! " + document.getElementById("proj"));
    var proj = document.getElementById("proj");
    var editor = document.getElementById("code");
    proj.addEventListener("selection", function (e) {
        // TODO: Show in editor...
        var file = e.target.selectedNode.getAttribute("file");
        var content = fs.readFileSync(file, 'utf8');
        // code-ify
        editor.innerHTML = "";
        // applyTextFormat(editor, content);
        tsserv.createTsView(editor, content, document);
    });
    var holder = document.getElementById('body');
    holder.ondragover = function (e) { return false; };
    holder.ondragleave = function (e) { return false; };
    holder.ondrop = function (e) {
        e.preventDefault();
        var file = e.dataTransfer.files[0];
        var filePath = file.path;
        alert("Drop: " + filePath);
        if (e.dataTransfer.files.length === 1) {
            if (fs.lstatSync(filePath).isDirectory()) {
                loadProject(filePath);
            }
        }
        return false;
    };
});
// Formatters
function applyTextFormat(host, text) {
    text.split("\n").forEach(function (line, index) {
        var lElem = document.createElement("ui-line");
        lElem.setAttribute("num", index.toString());
        lElem.textContent = line;
        host.appendChild(lElem);
    });
}
// Some random UI drop:
var resizerProto = Object.create(HTMLElement.prototype);
resizerProto.createdCallback = function () {
    var element = this;
    this.addEventListener("mousedown", function (e) {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    });
    function onMouseMove(e) {
        element.parentNode.childNodes[1].style["flex-basis"] = (e.clientX) + "px";
    }
    ;
    function onMouseUp(e) {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    }
};
var resizer = document.registerElement('x-resizer', { prototype: resizerProto });
