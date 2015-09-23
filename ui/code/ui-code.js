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
            var underlay = this.shadowRoot.getElementById("underlay");
            var context = underlay.getContext('2d');
            var range = document.createRange();
            var anchor;
            var isDragSelecting = false;
            var reposition = function (e) {
                underlay.style.top = _this.scrollTop;
                underlay.style.left = _this.scrollLeft;
                underlay.width = _this.clientWidth;
                underlay.height = _this.clientHeight;
            };
            this.addEventListener("scroll", reposition);
            this.addEventListener("onresize", reposition);
            this.addEventListener("mousedown", function (e) {
                anchor = document.caretRangeFromPoint(e.clientX, e.clientY);
                range.setStart(anchor.startContainer, anchor.startOffset);
                range.setEnd(anchor.endContainer, anchor.endOffset);
                isDragSelecting = true;
            });
            this.addEventListener("mousemove", function (e) {
                if (!isDragSelecting)
                    return;
                // console.log("Mouse move! " + e.clientX + " " + e.clientY + " - " + range);
                var current = document.caretRangeFromPoint(e.clientX, e.clientY);
                // TODO: Or swap if selecting backwards!
                var cmp = anchor.compareBoundaryPoints(Range.START_TO_START, current);
                if (cmp <= 0) {
                    range.setStart(anchor.startContainer, anchor.startOffset);
                    range.setEnd(current.endContainer, current.endOffset);
                }
                else {
                    range.setStart(current.endContainer, current.endOffset);
                    range.setEnd(anchor.startContainer, anchor.startOffset);
                }
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
                readLines(_this);
                var lineRects = [];
                var lineRange = document.createRange();
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (range.intersectsNode(line)) {
                        console.log("Intersects: " + line);
                        lineRange.setStartBefore(line.firstChild);
                        lineRange.setEndAfter(line.lastChild);
                        if (lineRange.compareBoundaryPoints(Range.START_TO_START, range) < 0) {
                            lineRange.setStart(range.startContainer, range.startOffset);
                        }
                        if (lineRange.compareBoundaryPoints(Range.END_TO_END, range) > 0) {
                            lineRange.setEnd(range.endContainer, range.endOffset);
                        }
                        var ranges = lineRange.getClientRects();
                        var lineRect = {
                            left: ranges[0].left - 1,
                            top: ranges[0].top - 1,
                            right: ranges[ranges.length - 1].right + 1,
                            bottom: ranges[ranges.length - 1].bottom + 1
                        };
                        lineRect.width = lineRect.right - lineRect.left;
                        lineRect.height = lineRect.bottom - lineRect.top;
                        lineRects.push(lineRect);
                    }
                }
                context.fillStyle = "#DDDDDD";
                context.fillRect(0, 0, underlay.width, underlay.height);
                context.strokeStyle = "#999999";
                context.lineWidth = 1;
                context.fillStyle = "#FFFFFF";
                var cRect = underlay.getBoundingClientRect();
                for (var i = 0; i < lineRects.length; i++) {
                    var rect = lineRects[i];
                    context.strokeRect(Math.floor(rect.left) - Math.floor(cRect.left), Math.floor(rect.top) - Math.floor(cRect.top), Math.ceil(rect.width), Math.ceil(rect.height));
                }
                for (var i = 0; i < lineRects.length; i++) {
                    var rect = lineRects[i];
                    context.fillRect(Math.floor(rect.left) - Math.floor(cRect.left), Math.floor(rect.top) - Math.floor(cRect.top), Math.ceil(rect.width), Math.ceil(rect.height));
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
            });
            this.addEventListener("mouseup", function (e) {
                // console.log("Mouse up! " + e.clientX + " " + e.clientY);
                isDragSelecting = false;
            });
            this.addEventListener("click", function (e) {
                // Set carret on the clicked point.
            });
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