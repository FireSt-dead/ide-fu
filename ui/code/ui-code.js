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
    var Code = (function (_super) {
        __extends(Code, _super);
        function Code() {
            _super.apply(this, arguments);
        }
        Code.prototype.createdCallback = function () {
            var root = this.createShadowRoot();
            var template = Code.document.getElementById("ui-code");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
        };
        Code.document = document.currentScript.ownerDocument;
        Code = __decorate([
            component("ui-code")
        ], Code);
        return Code;
    })(HTMLElement);
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            _super.apply(this, arguments);
        }
        Block.prototype.createdCallback = function () {
            var _this = this;
            var root = this.createShadowRoot();
            var template = Block.document.getElementById("ui-block");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
            // Apply template:
            var expanderElement = root.querySelector('#expander');
            expanderElement.addEventListener("click", function (e) {
                if (_this.getAttribute('collapsed')) {
                    _this.removeAttribute('collapsed');
                }
                else {
                    _this.setAttribute('collapsed', true);
                }
                e.stopPropagation();
            });
            expanderElement.addEventListener("mouseenter", function (e) {
                var tree = parentOfType(_this, Code);
                tree.setAttribute("collapsing", true);
                _this.setAttribute("collapsing", true);
            });
            expanderElement.addEventListener("mouseleave", function (e) {
                var tree = parentOfType(_this, Code);
                tree.removeAttribute("collapsing");
                _this.removeAttribute("collapsing");
            });
        };
        Block.document = document.currentScript.ownerDocument;
        Block = __decorate([
            component("ui-block")
        ], Block);
        return Block;
    })(HTMLElement);
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line() {
            _super.apply(this, arguments);
        }
        Line.prototype.createdCallback = function () {
            var root = this.createShadowRoot();
            var template = Line.document.getElementById("ui-line");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
            // Apply template:
            var num = this.getAttribute('num');
            var numElement = root.querySelector('#num');
            numElement.innerHTML = num;
        };
        Line.document = document.currentScript.ownerDocument;
        Line = __decorate([
            component("ui-line")
        ], Line);
        return Line;
    })(HTMLElement);
})(ui || (ui = {}));
//# sourceMappingURL=ui-code.js.map