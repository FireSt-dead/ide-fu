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
            var _this = this;
            var root = this.createShadowRoot();
            var template = Code.document.getElementById("ui-code");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
            this.underlay = this.shadowRoot.getElementById("underlay");
            this.context = this.underlay.getContext('2d');
            this.range = document.createRange();
            var anchor;
            var isDragSelecting = false;
            var reposition = function (e) {
                _this.underlay.style.top = _this.scrollTop;
                _this.underlay.style.left = _this.scrollLeft;
                _this.underlay.width = _this.clientWidth;
                _this.underlay.height = _this.clientHeight;
            };
            this.addEventListener("scroll", reposition);
            this.addEventListener("onresize", reposition);
            this.addEventListener("mousedown", function (e) {
                anchor = document.caretRangeFromPoint(e.clientX, e.clientY);
                _this.range.setStart(anchor.startContainer, anchor.startOffset);
                _this.range.setEnd(anchor.endContainer, anchor.endOffset);
                isDragSelecting = true;
                _this.reselect();
            });
            this.addEventListener("mousemove", function (e) {
                if (!isDragSelecting)
                    return;
                // console.log("Mouse move! " + e.clientX + " " + e.clientY + " - " + range);
                var current = document.caretRangeFromPoint(e.clientX, e.clientY);
                // TODO: Or swap if selecting backwards!
                var cmp = anchor.compareBoundaryPoints(Range.START_TO_START, current);
                if (cmp <= 0) {
                    _this.range.setStart(anchor.startContainer, anchor.startOffset);
                    _this.range.setEnd(current.endContainer, current.endOffset);
                }
                else {
                    _this.range.setStart(current.endContainer, current.endOffset);
                    _this.range.setEnd(anchor.startContainer, anchor.startOffset);
                }
                _this.reselect();
            });
            this.addEventListener("mouseup", function (e) {
                isDragSelecting = false;
            });
            document.addEventListener("keypress", function (e) {
                var c = String.fromCharCode(e.which);
                // console.log("Key press: " + txt);
                _this.range.deleteContents();
                var node = document.createTextNode(c);
                _this.range.insertNode(node);
                _this.range.setStart(node, 1);
                _this.range.setEnd(node, 1);
                _this.reselect();
            });
        };
        Code.prototype.reselect = function () {
            var lines = [];
            function readLines(elem) {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var child = elem.childNodes[i];
                    if (child instanceof Line) {
                        lines.push(child);
                    }
                    else {
                        readLines(child);
                    }
                }
            }
            readLines(this);
            var lineRects = [];
            var lineRange = document.createRange();
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (this.range.intersectsNode(line)) {
                    console.log("Intersects: " + line);
                    lineRange.setStartBefore(line.firstChild);
                    lineRange.setEndAfter(line.lastChild);
                    if (lineRange.compareBoundaryPoints(Range.START_TO_START, this.range) < 0) {
                        lineRange.setStart(this.range.startContainer, this.range.startOffset);
                    }
                    if (lineRange.compareBoundaryPoints(Range.END_TO_END, this.range) > 0) {
                        lineRange.setEnd(this.range.endContainer, this.range.endOffset);
                    }
                    var ranges = lineRange.getClientRects();
                    console.dir(ranges);
                    var lineRect = {
                        left: ranges[0].left + 1,
                        top: ranges[0].top,
                        right: ranges[ranges.length - 1].right,
                        bottom: ranges[ranges.length - 1].bottom - 1
                    };
                    lineRect.width = lineRect.right - lineRect.left;
                    lineRect.height = lineRect.bottom - lineRect.top;
                    lineRects.push(lineRect);
                }
            }
            // this.context.fillStyle = "#DDDDDD";
            this.context.clearRect(0, 0, this.underlay.width, this.underlay.height);
            this.context.strokeStyle = "#002266";
            this.context.lineWidth = 1;
            this.context.fillStyle = "#AACCEE";
            var cRect = this.underlay.getBoundingClientRect();
            for (var i = 0; i < lineRects.length; i++) {
                var rect = lineRects[i];
                this.context.strokeRect(Math.floor(rect.left) - Math.floor(cRect.left), Math.floor(rect.top) - Math.floor(cRect.top), Math.ceil(rect.width), Math.ceil(rect.height));
            }
            for (var i = 0; i < lineRects.length; i++) {
                var rect = lineRects[i];
                this.context.fillRect(Math.floor(rect.left) - Math.floor(cRect.left), Math.floor(rect.top) - Math.floor(cRect.top), Math.ceil(rect.width), Math.ceil(rect.height));
            }
            /*
            var cRect = underlay.getBoundingClientRect();
            
            var rects = range.getClientRects();
            context.clearRect(0, 0, underlay.width, underlay.height);
            context.strokeStyle = "red";
            
            for (var i = 0; i < rects.length; i++) {
              var rect = rects[i];
              context.strokeRect(Math.floor(rect.left) - 0.5 - cRect.left, Math.floor(rect.top) - 0.5 - cRect.top, Math.ceil(rect.width), Math.ceil(rect.height));
            }
            */
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
        Line.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
            if (name === "num") {
                var numElement = this.shadowRoot.querySelector('#num');
                numElement.innerHTML = newValue;
            }
        };
        Line.document = document.currentScript.ownerDocument;
        Line = __decorate([
            component("ui-line")
        ], Line);
        return Line;
    })(HTMLElement);
})(ui || (ui = {}));
//# sourceMappingURL=ui-code.js.map