import fs = require("fs");
import path = require("path");

var tsserv = require("./services/ts-lang");

try {
	var txt = "";
	var traverse = function(basePath: string) {
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
	}
	traverse("./");
	setTimeout(() => {
		document.getElementById("proj").innerHTML = txt;
	}, 1);
} catch(e) {
	alert(e.toString());
}

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
});

// Formatters
function applyTextFormat(host: Element, text: string) {
	text.split("\n").forEach((line, index) => {
		var lElem = document.createElement("ui-line");
		lElem.setAttribute("num", index);
		lElem.textContent = line;
		host.appendChild(lElem); 
	});
}

// UI

/**
 * Register the class as custom web element.
 */
function component(name: string) {
	return (target: any) => {
		document.registerElement(name, { prototype: target.prototype });
		return target;
	}
}

function parentOfType(node: Node, type: any) {
	var element = node;
	while(element && !(element instanceof type)) {
		element = element.parentNode;
	}
	return element;
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
