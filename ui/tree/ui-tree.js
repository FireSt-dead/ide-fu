var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var ui;
(function (ui) {
    var Tree = (function (_super) {
        __extends(Tree, _super);
        function Tree() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(Tree.prototype, "selectedNode", {
            get: function () { return this._selectedNode; },
            enumerable: true,
            configurable: true
        });
        Tree.prototype.createdCallback = function () {
            var t = Tree.document.getElementById('ui-tree');
            var clone = document.importNode(t.content, true);
            var shadow = this.createShadowRoot();
            shadow.appendChild(clone);
        };
        Tree.prototype.select = function (node) {
            if (this._selectedNode) {
                this._selectedNode.removeAttribute("selected");
            }
            this._selectedNode = node;
            if (node) {
                node.setAttribute("selected", true);
            }
            var event = new Event("selection");
            this.dispatchEvent(event);
        };
        Tree.document = document.currentScript.ownerDocument;
        Tree = __decorate([
            component("ui-tree")
        ], Tree);
        return Tree;
    })(HTMLElement);
    var Node = (function (_super) {
        __extends(Node, _super);
        function Node() {
            _super.apply(this, arguments);
        }
        Node.prototype.createdCallback = function () {
            var t = Node.document.getElementById('ui-node');
            var clone = document.importNode(t.content, true);
            var shadow = this.createShadowRoot();
            shadow.appendChild(clone);
            // Apply template:
            var title = this.getAttribute('title');
            var titleElement = shadow.querySelector('#title');
            titleElement.innerHTML = title;
            // depth
            var depth = 0;
            var parent = this.parentNode;
            while (parent && !(parent instanceof Tree)) {
                if (parent instanceof Node) {
                    depth++;
                }
                parent = parent.parentNode;
            }
            var headElement = shadow.querySelector("#head");
            headElement.style.padding = "0px 0px 0px " + (depth * 20) + "px";
            this.addEventListener("click", function (e) {
                console.log("Where: " + this);
                if (this.childNodes.length > 0) {
                    if (this.getAttribute('collapsed')) {
                        this.removeAttribute('collapsed');
                    }
                    else {
                        this.setAttribute('collapsed', true);
                    }
                }
                else {
                    var tree = this;
                    while (tree) {
                        if (tree instanceof Tree) {
                            tree.select(this);
                            break;
                        }
                        tree = tree.parentNode;
                    }
                }
                // Probably there is a better way to mark a node has been collapsed...
                e.stopPropagation();
            });
        };
        Node.document = document.currentScript.ownerDocument;
        Node = __decorate([
            component("ui-node")
        ], Node);
        return Node;
    })(HTMLElement);
})(ui || (ui = {}));
//# sourceMappingURL=ui-tree.js.map