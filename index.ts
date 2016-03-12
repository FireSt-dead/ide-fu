import fs = require("fs");
import path = require("path");

require("./ui/core");

/**
 * Register the class as custom web element.
 */
function component(name: string): ClassDecorator {
	return (target: any) => {
		document.registerElement(name, { prototype: target.prototype });
		return target;
	}
}

// UI
function parentOfType(node: Node, type: any): Node {
	var element = node;
	while (element && !(element instanceof type)) {
		element = element.parentNode;
	}
	return element;
}

var gui = require('nw.gui');
console.log("Args: " + gui.App.argv);

var projectPath: string;
if (gui.App.argv.length >= 1) {
    projectPath = path.resolve(gui.App.argv[0]);
} else {
    projectPath = process.cwd();
}
var tsserv = require("./services/ts-lang");

function loadProject(p: string) {
	try {
		var txt = "";
		var traverse = function(basePath: string) {
			try {
				fs.readdirSync(basePath).forEach(file => {
					var currentPath = path.resolve(basePath, file);
					txt += "<ui-node title=\"" + file + "\" file=\"" + currentPath + "\"";
					if (fs.statSync(currentPath).isDirectory()) {
						txt += " collapsed=\"true\">";
						traverse(currentPath);
					} else {
						txt += " extension=\"" + path.extname(file) + "\""
						txt += ">";
					}
					txt += "</ui-node>";
				});
			} catch (e) {
				// alert(e.toString());
			}
		}
		traverse(p);
		setTimeout(() => {
			document.getElementById("proj").innerHTML = txt;
		}, 1);
	} catch (e) {
		alert(e.toString());
	}
}
loadProject(projectPath);

window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

document.addEventListener("DOMContentLoaded", (e: any) => {
	// alert("Load! " + document.getElementById("proj"));
	var proj = document.getElementById("proj");
	var editor = document.getElementById("code");
	proj.addEventListener("selection", (e: any) => {
		// TODO: Show in editor...
		var file = e.target.selectedNode.getAttribute("file");
		var content = fs.readFileSync(file, 'utf8');
		
		// code-ify
		editor.innerHTML = "";
		
		// applyTextFormat(editor, content);
		tsserv.createTsView(editor, content, document);
	});

	var holder = document.getElementById('body');
	holder.ondragover = e => false;
	holder.ondragleave = e => false;
	holder.ondrop = e => {
		e.preventDefault();
        var file = e.dataTransfer.files[0];
        var filePath:string = (<any>file).path;
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
function applyTextFormat(host: Element, text: string) {
	text.split("\n").forEach((line, index) => {
		var lElem = document.createElement("ui-line");
		lElem.setAttribute("num", index.toString());
		lElem.textContent = line;
		host.appendChild(lElem);
	});
}

// Some random UI drop:
var resizerProto = Object.create(HTMLElement.prototype);
resizerProto.createdCallback = function() {
	var element = this;
	this.addEventListener("mousedown", (e: any) => {
		window.addEventListener("mousemove", onMouseMove);
		window.addEventListener("mouseup", onMouseUp);
	});
	function onMouseMove(e: any) {
		element.parentNode.childNodes[1].style["flex-basis"] = (e.clientX) + "px";
	};
	function onMouseUp(e: any) {
		window.removeEventListener("mousemove", onMouseMove);
		window.removeEventListener("mouseup", onMouseUp);
	}
};
var resizer = document.registerElement('x-resizer', { prototype: resizerProto });
