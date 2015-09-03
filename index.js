var fs = require("fs");
var path = require("path");
var tsserv = require("./services/ts-lang");
try {
    var txt = "";
    var traverse = function (basePath) {
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
    };
    traverse("./");
    setTimeout(function () {
        document.getElementById("proj").innerHTML = txt;
    }, 1);
}
catch (e) {
    alert(e.toString());
}
document.addEventListener("DOMContentLoaded", function (e) {
    // alert("Load! " + document.getElementById("proj"));
    var proj = document.getElementById("proj");
    var editor = document.getElementById("edit");
    proj.addEventListener("selection", function (e) {
        // TODO: Show in editor...
        var file = e.target.selectedNode.getAttribute("file");
        editor.textContent = fs.readFileSync(file, 'utf8');
    });
});
// UI
/**
 * Register the class as custom web element.
 */
function component(name) {
    return function (target) {
        document.registerElement(name, { prototype: target.prototype });
        return target;
    };
}
function parentOfType(node, type) {
    var element = node;
    while (element && !(element instanceof type)) {
        element = element.parentNode;
    }
    return element;
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
