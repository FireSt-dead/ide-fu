module ui {

    interface LineRect {
        left: number;
        top: number;
        right: number;
        bottom: number;
        width: number;
        height: number;
    }

    @component("ui-code")
    class Code extends HTMLElement {
        static document: Document = document.currentScript.ownerDocument;

        underlayElem: any;
        context: any;
        caretElem: any;

        selectionRange: Range;
        caretRange: Range;
        anchorRange: Range;

        isDragSelecting: boolean;

        createdCallback() {
            var root = this.createShadowRoot();
            var template = <Template>Code.document.getElementById("ui-code");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);

            this.underlayElem = this.shadowRoot.getElementById("underlay");
            this.context = this.underlayElem.getContext('2d');
            this.caretElem = this.shadowRoot.getElementById("caret");

            this.selectionRange = document.createRange();

            this.isDragSelecting = false;

            // TODO: Create separate methods for scroll and resize and invalidate redraws there.
            this.addEventListener("scroll", this.redrawSelection.bind(this));
            this.addEventListener("resize", this.resizeUnderlay.bind(this));

            this.addEventListener("mousedown", this.mousedown.bind(this));
            this.addEventListener("mousemove", this.mousemove.bind(this));
            this.addEventListener("mouseup", this.mouseup.bind(this));

            document.addEventListener("keypress", this.keypress.bind(this));
        }
        
        mousedown(e: MouseEvent) {
            this.anchorRange = this.caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
            this.redrawCaret();
            this.selectionRange.setStart(this.anchorRange.startContainer, this.anchorRange.startOffset);
            this.selectionRange.setEnd(this.anchorRange.endContainer, this.anchorRange.endOffset);
            this.isDragSelecting = true;

            this.redrawSelection();
        }
        
        mousemove(e: MouseEvent) {
            if (!this.isDragSelecting)
                return;

            this.caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
            this.redrawCaret();

            var cmp = this.anchorRange.compareBoundaryPoints(Range.START_TO_START, this.caretRange);
            if (cmp <= 0) {
                this.selectionRange.setStart(this.anchorRange.startContainer, this.anchorRange.startOffset);
                this.selectionRange.setEnd(this.caretRange.endContainer, this.caretRange.endOffset);
            } else {
                this.selectionRange.setStart(this.caretRange.endContainer, this.caretRange.endOffset);
                this.selectionRange.setEnd(this.anchorRange.startContainer, this.anchorRange.startOffset);
            }

            this.redrawSelection();
        }
        
        mouseup(e: MouseEvent) {
            this.isDragSelecting = false;
        }

        keypress(e: KeyboardEvent) {
            console.log("Tap! " + e);
            if (e.key == "8" /* backspace */) {

            } else {
                var c = String.fromCharCode(e.which);
                // TODO: This works only if the selection is within a single line.
                this.selectionRange.deleteContents();
                var node = document.createTextNode(c);
                this.selectionRange.insertNode(node);
                this.selectionRange.setStart(node, 1);
                this.caretRange.setEnd(node, 1);
                this.caretRange.setStart(node, 1);
                this.selectionRange.setEnd(node, 1);
            }
            // TODO: Invalidate using requestAnimationFrame instead of immediate redraw.
            this.redrawSelection();
            this.redrawCaret();
            e.preventDefault();
            return false;
        }

        resizeUnderlay() {
            this.underlayElem.style.top = this.scrollTop;
            this.underlayElem.style.left = this.scrollLeft;
            this.underlayElem.width = this.clientWidth;
            this.underlayElem.height = this.clientHeight;
            this.redrawCaret();
        }

        redrawCaret() {
            var rects = this.caretRange.getClientRects();
            if (rects.length > 0) {
                var rect = rects[0];
                var cRect = this.underlayElem.getBoundingClientRect();
                this.caretElem.style.top = rect.top - cRect.top + this.scrollTop;
                this.caretElem.style.left = rect.left - cRect.left;
                this.caretElem.style.height = rect.height;
                this.caretElem.style.width = 2;
            }
        }

        redrawSelection() {
            this.resizeUnderlay();
            this.context.clearRect(0, 0, this.underlayElem.width, this.underlayElem.height);

            if (this.selectionRange.collapsed) {
                return;
            }

            var lines = new Array<Line>();
            function readLines(elem: Node) {
                for (var i = 0; i < elem.childNodes.length; i++) {
                    var child = elem.childNodes[i];
                    if (child instanceof Line) {
                        lines.push(child);
                    } else {
                        readLines(child);
                    }
                }
            }
            readLines(this);

            var lineRects = new Array<LineRect>();
            var lineRange = document.createRange();
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];

                if (this.selectionRange.intersectsNode(line)) {
                    lineRange.setStartBefore(line.firstChild);
                    lineRange.setEndAfter(line.lastChild);

                    if (lineRange.compareBoundaryPoints(Range.START_TO_START, this.selectionRange) < 0) {
                        lineRange.setStart(this.selectionRange.startContainer, this.selectionRange.startOffset);
                    }
                    if (lineRange.compareBoundaryPoints(Range.END_TO_END, this.selectionRange) > 0) {
                        lineRange.setEnd(this.selectionRange.endContainer, this.selectionRange.endOffset);
                    }

                    var ranges = lineRange.getClientRects();

                    var left: number = ranges[0].left + 1;
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
                } else if (right < x) {
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
                    this.context.arc(left - r, bottom - r, r, 1 / 2 * Math.PI, 0, true)
                } else if (left < x) {
                    this.context.arc(x - r, bottom + r, r, 0, -1 / 2 * Math.PI, true);
                    this.context.arc(left + r, bottom - r, r, 1 / 2 * Math.PI, Math.PI, false);
                }

                x = left;
            }

            this.context.strokeStyle = "#99BBDD";
            this.context.lineWidth = 1;
            this.context.fillStyle = "#AACCEE";

            this.context.closePath();
            this.context.fill();
            this.context.stroke();
        }
    }

    @component("ui-block")
    class Block extends HTMLElement {
        static document: Document = document.currentScript.ownerDocument;
        createdCallback() {
            var root = this.createShadowRoot();
            var template = <Template>Block.document.getElementById("ui-block");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);

            // Apply template:
            var expanderElement = root.querySelector('#expander');
            expanderElement.addEventListener("click", e => {
                if (this.getAttribute('collapsed')) {
                    this.removeAttribute('collapsed');
                } else {
                    this.setAttribute('collapsed', true.toString());
                }
                e.stopPropagation();
            });

            expanderElement.addEventListener("mouseenter", e => {
                var tree = <Element>parentOfType(this, Code);
                tree.setAttribute("collapsing", true.toString());
                this.setAttribute("collapsing", true.toString());
            });

            expanderElement.addEventListener("mouseleave", e => {
                var tree = <Element>parentOfType(this, Code);
                tree.removeAttribute("collapsing");
                this.removeAttribute("collapsing");
            });
        }
    }

    @component("ui-line")
    class Line extends HTMLElement {
        static document: Document = document.currentScript.ownerDocument;
        createdCallback(): void {
            var root = this.createShadowRoot();
            var template = <Template>Line.document.getElementById("ui-line");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);

            // Apply template:
            var num = this.getAttribute('num');
            var numElement = <HTMLElement>root.querySelector('#num');
            numElement.innerHTML = num;
        }

        attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
            if (name === "num") {
                var numElement = <HTMLElement>this.shadowRoot.querySelector('#num');
                numElement.innerHTML = newValue;
            }
        }
    }
}

