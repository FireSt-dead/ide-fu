var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
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
            this.underlayElem = this.shadowRoot.getElementById("underlay");
            this.context = this.underlayElem.getContext('2d');
            this.caretElem = this.shadowRoot.getElementById("caret");
            this.selectionRange = document.createRange();
            var isDragSelecting = false;
            this.addEventListener("scroll", function (e) {
                _this.redrawSelection();
            });
            this.addEventListener("resize", function (e) { return _this.onResize(); });
            this.addEventListener("mousedown", function (e) {
                _this.anchorRange = _this.caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
                _this.redrawCaret();
                _this.selectionRange.setStart(_this.anchorRange.startContainer, _this.anchorRange.startOffset);
                _this.selectionRange.setEnd(_this.anchorRange.endContainer, _this.anchorRange.endOffset);
                isDragSelecting = true;
                _this.redrawSelection();
            });
            this.addEventListener("mousemove", function (e) {
                if (!isDragSelecting)
                    return;
                _this.caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
                _this.redrawCaret();
                var cmp = _this.anchorRange.compareBoundaryPoints(Range.START_TO_START, _this.caretRange);
                if (cmp <= 0) {
                    _this.selectionRange.setStart(_this.anchorRange.startContainer, _this.anchorRange.startOffset);
                    _this.selectionRange.setEnd(_this.caretRange.endContainer, _this.caretRange.endOffset);
                }
                else {
                    _this.selectionRange.setStart(_this.caretRange.endContainer, _this.caretRange.endOffset);
                    _this.selectionRange.setEnd(_this.anchorRange.startContainer, _this.anchorRange.startOffset);
                }
                _this.redrawSelection();
            });
            this.addEventListener("mouseup", function (e) {
                isDragSelecting = false;
            });
            document.addEventListener("keypress", function (e) {
                var c = String.fromCharCode(e.which);
                // console.log("Key press: " + txt);
                _this.selectionRange.deleteContents();
                var node = document.createTextNode(c);
                _this.selectionRange.insertNode(node);
                _this.selectionRange.setStart(node, 1);
                _this.caretRange.setEnd(node, 1);
                _this.caretRange.setStart(node, 1);
                _this.selectionRange.setEnd(node, 1);
                _this.redrawSelection();
                _this.redrawCaret();
                e.preventDefault();
            });
        };
        Code.prototype.onResize = function () {
            this.underlayElem.style.top = this.scrollTop;
            this.underlayElem.style.left = this.scrollLeft;
            this.underlayElem.width = this.clientWidth;
            this.underlayElem.height = this.clientHeight;
            this.redrawCaret();
        };
        Code.prototype.redrawCaret = function () {
            var rects = this.caretRange.getClientRects();
            if (rects.length > 0) {
                var rect = rects[0];
                var cRect = this.underlayElem.getBoundingClientRect();
                this.caretElem.style.top = rect.top - cRect.top + this.scrollTop;
                this.caretElem.style.left = rect.left - cRect.left;
                this.caretElem.style.height = rect.height;
                this.caretElem.style.width = 2;
            }
        };
        Code.prototype.redrawSelection = function () {
            this.onResize();
            this.context.clearRect(0, 0, this.underlayElem.width, this.underlayElem.height);
            if (this.selectionRange.collapsed) {
                return;
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
            readLines(this);
            var lineRects = [];
            var lineRange = document.createRange();
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                if (this.selectionRange.intersectsNode(line)) {
                    console.log("Intersects: " + line);
                    lineRange.setStartBefore(line.firstChild);
                    lineRange.setEndAfter(line.lastChild);
                    if (lineRange.compareBoundaryPoints(Range.START_TO_START, this.selectionRange) < 0) {
                        lineRange.setStart(this.selectionRange.startContainer, this.selectionRange.startOffset);
                    }
                    if (lineRange.compareBoundaryPoints(Range.END_TO_END, this.selectionRange) > 0) {
                        lineRange.setEnd(this.selectionRange.endContainer, this.selectionRange.endOffset);
                    }
                    var ranges = lineRange.getClientRects();
                    if (ranges.length == 1) {
                        console.log("left: " + ranges[0].left + " " + ranges[ranges.length - 1].right);
                    }
                    var left = ranges[0].left + 1;
                    var top = ranges[0].top;
                    var right = Math.max(left, ranges[ranges.length - 1].right);
                    var bottom = Math.max(top, ranges[ranges.length - 1].bottom - 1);
                    var width = right - left;
                    var height = bottom - top;
                    var lineRect = {
                        left: left,
                        top: top,
                        right: right,
                        bottom: bottom,
                        width: width,
                        height: height
                    };
                    lineRects.push(lineRect);
                }
            }
            if (lineRects.length == 0) {
                return;
            }
            var cRect = this.underlayElem.getBoundingClientRect();
            var rad = 4.5;
            this.context.beginPath();
            var rect = lineRects[0];
            var top = Math.floor(rect.top) - Math.floor(cRect.top) - 0.5;
            var left = Math.floor(rect.left) - Math.floor(cRect.left) - 0.5;
            var right = Math.ceil(left + rect.width) + 0.5;
            var bottom = Math.ceil(top + rect.height) + 0.5;
            var r = Math.min(rad, Math.abs(right - left));
            this.context.moveTo(left, top + r);
            this.context.arc(left + r, top + r, r, Math.PI, -1 / 2 * Math.PI, false);
            this.context.arc(right - r, top + r, r, -1 / 2 * Math.PI, 0, false);
            var x = right;
            for (var i = 1; i < lineRects.length; i++) {
                var rect = lineRects[i];
                var top = Math.floor(rect.top) - Math.floor(cRect.top) - 0.5;
                var left = Math.floor(rect.left) - Math.floor(cRect.left) - 0.5;
                var right = Math.ceil(left + rect.width) + 0.5;
                var bottom = Math.ceil(top + rect.height) + 0.5;
                var r = Math.min(rad, Math.abs(right - x) / 2);
                if (right > x) {
                    this.context.arc(x + r, top - r, r, Math.PI, 1 / 2 * Math.PI, true);
                    this.context.arc(right - r, top + r, r, -1 / 2 * Math.PI, 0, false);
                }
                else if (right < x) {
                    this.context.arc(x - r, top - r, r, 0, 1 / 2 * Math.PI, false);
                    this.context.arc(right + r, top + r, r, -1 / 2 * Math.PI, Math.PI, true);
                }
                x = right;
            }
            var rect = lineRects[lineRects.length - 1];
            var top = Math.floor(rect.top) - Math.floor(cRect.top) - 0.5;
            var left = Math.floor(rect.left) - Math.floor(cRect.left) - 0.5;
            var right = Math.ceil(left + rect.width) + 0.5;
            var bottom = Math.ceil(top + rect.height) + 0.5;
            var r = Math.min(rad, Math.abs(right - left));
            this.context.arc(right - r, bottom - r, r, 0, 1 / 2 * Math.PI, false);
            this.context.arc(left + r, bottom - r, r, 1 / 2 * Math.PI, Math.PI, false);
            x = left;
            for (var i = lineRects.length - 2; i >= 0; i--) {
                var rect = lineRects[i];
                var top = Math.floor(rect.top) - Math.floor(cRect.top) - 0.5;
                var left = Math.floor(rect.left) - Math.floor(cRect.left) - 0.5;
                var right = Math.ceil(left + rect.width) + 0.5;
                var bottom = Math.ceil(top + rect.height) + 0.5;
                var r = Math.min(rad, Math.abs(left - x) / 2);
                if (left > x) {
                    this.context.arc(x + r, bottom + r, r, Math.PI, -1 / 2 * Math.PI, false);
                    this.context.arc(left - r, bottom - r, r, 1 / 2 * Math.PI, 0, true);
                }
                else if (left < x) {
                    this.context.arc(x - r, bottom + r, r, 0, -1 / 2 * Math.PI, true);
                    this.context.arc(left + r, bottom - r, r, 1 / 2 * Math.PI, Math.PI, false);
                }
                x = left;
            }
            // this.context.strokeStyle = "#002266";
            this.context.strokeStyle = "#99BBDD";
            this.context.lineWidth = 1;
            this.context.fillStyle = "#AACCEE";
            this.context.closePath();
            this.context.fill();
            this.context.stroke();
            /*
            var leftPoints = [];
            var rightPoints = [];
            for (var i = 0; i < lineRects.length; i++) {
              var rect = lineRects[i];
              var left = Math.floor(rect.left) - Math.floor(cRect.left) - 0.5;
              var top = Math.floor(rect.top) - Math.floor(cRect.top) - 0.5;
              var right = Math.ceil(left + rect.width) + 0.5;
              var bottom = Math.ceil(top + rect.height) + 0.5;
              // TODO: If left or right edges equal, just extend the last point...
              leftPoints.push({ x: left, y: top });
              leftPoints.push({ x: left, y: bottom });
              rightPoints.push({ x: right, y: top });
              rightPoints.push({ x: right, y: bottom });
            }
            
            this.context.beginPath();
            
            this.context.moveTo(rightPoints[0].x, rightPoints[0].y);
            for (var i = 1; i < rightPoints.length; i++) {
              var point = rightPoints[i];
              this.context.lineTo(point.x, point.y);
            }
            for (var i = leftPoints.length - 1; i >= 0; i--) {
              var point = leftPoints[i];
              this.context.lineTo(point.x, point.y);
            }
            this.context.closePath();
            this.context.fill();
            this.context.stroke();
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