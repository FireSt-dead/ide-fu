module ui {
  @component("ui-code")
  class Code extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    
    underlayElem: any;
    context: any;
    caretElem: any;
    
    selectionRange: any;
    caretRange: any;
    anchorRange: any;
    
    createdCallback() {
      var root = this.createShadowRoot();
      var template = Code.document.getElementById("ui-code");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
      
      this.underlayElem = this.shadowRoot.getElementById("underlay");
      this.context = this.underlayElem.getContext('2d');
      this.caretElem = this.shadowRoot.getElementById("caret");
      
      this.selectionRange = document.createRange();
      
      var isDragSelecting = false;
      
      this.addEventListener("scroll", e => this.onResize());
      this.addEventListener("resize", e => this.onResize());
      
      this.addEventListener("mousedown", e => {
        this.anchorRange = this.caretRange = document.caretRangeFromPoint(e.clientX, e.clientY);
        this.redrawCaret();
        this.selectionRange.setStart(this.anchorRange.startContainer, this.anchorRange.startOffset);
        this.selectionRange.setEnd(this.anchorRange.endContainer, this.anchorRange.endOffset);
        isDragSelecting = true;
        
        this.redrawSelection();
      });
      
      this.addEventListener("mousemove", e => {
        if (!isDragSelecting)
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
      });
      
      this.addEventListener("mouseup", e => {
        isDragSelecting = false;
      });
      
      document.addEventListener("keypress", e => {
        var c = String.fromCharCode(e.which);
        // console.log("Key press: " + txt);
        this.selectionRange.deleteContents();
        var node = document.createTextNode(c);
        this.selectionRange.insertNode(node);
        this.selectionRange.setStart(node, 1);
        this.caretRange.setEnd(node, 1);
        this.caretRange.setStart(node, 1);
        this.selectionRange.setEnd(node, 1);
        this.redrawSelection();
        this.redrawCaret();
      });
    }
    
    onResize() {
        this.underlayElem.style.top = this.scrollTop;
        this.underlayElem.style.left = this.scrollLeft;
        this.underlayElem.width = this.clientWidth;
        this.underlayElem.height = this.clientHeight;
    }
    
    redrawCaret() {
        var rects = this.caretRange.getClientRects();
        if (rects.length > 0) {
          var rect = rects[0];
          var cRect = this.underlayElem.getBoundingClientRect();
          this.caretElem.style.top = rect.top - cRect.top;
          this.caretElem.style.left = rect.left - cRect.left - 1;
          this.caretElem.style.height = rect.height;
          this.caretElem.style.width = 2;
        }
    }
      
    redrawSelection() {
      
        this.onResize();
        this.context.clearRect(0, 0, this.underlayElem.width, this.underlayElem.height);
        
        if (this.selectionRange.collapsed) {
          return;
        }
      
        var lines = [];
        function readLines(elem: Element) {
          for(var i = 0; i < elem.childNodes.length; i++) {
            var child = elem.childNodes[i];
            if (child instanceof Line) {
              lines.push(child);
            } else {
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
        
        this.context.strokeStyle = "#002266";
        this.context.lineWidth = 1;
        this.context.fillStyle = "#AACCEE";
        
        var cRect = this.underlayElem.getBoundingClientRect();
        
        for (var i = 0; i < lineRects.length; i++) {
          var rect = lineRects[i];
          this.context.strokeRect(Math.floor(rect.left) - Math.floor(cRect.left), Math.floor(rect.top) - Math.floor(cRect.top), Math.ceil(rect.width), Math.ceil(rect.height));
        }
        
        for (var i = 0; i < lineRects.length; i++) {
          var rect = lineRects[i];
          this.context.fillRect(Math.floor(rect.left) - Math.floor(cRect.left), Math.floor(rect.top) - Math.floor(cRect.top), Math.ceil(rect.width), Math.ceil(rect.height));
        }
      }
  }
  
  @component("ui-block")
  class Block extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    createdCallback() {
      var root = this.createShadowRoot();
      var template = Block.document.getElementById("ui-block");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
      
      // Apply template:
      var expanderElement = root.querySelector('#expander');
      expanderElement.addEventListener("click", e => {
          if (this.getAttribute('collapsed')) {
            this.removeAttribute('collapsed');
          } else {
            this.setAttribute('collapsed', true);
          }
        e.stopPropagation();
      });
      
      expanderElement.addEventListener("mouseenter", e => {
        var tree = parentOfType(this, Code);
        tree.setAttribute("collapsing", true);
        this.setAttribute("collapsing", true);
      });
      
      expanderElement.addEventListener("mouseleave", e => {
        var tree = parentOfType(this, Code);
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
      var template = Line.document.getElementById("ui-line");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
      
      // Apply template:
			var num = this.getAttribute('num');
			var numElement = root.querySelector('#num');
			numElement.innerHTML = num;
    }
    
    attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
      if (name === "num") {
        var numElement = this.shadowRoot.querySelector('#num');
			  numElement.innerHTML = newValue;
      }
    }
  }
}

