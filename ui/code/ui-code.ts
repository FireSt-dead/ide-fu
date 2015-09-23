module ui {
  @component("ui-code")
  class Code extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    createdCallback() {
      var root = this.createShadowRoot();
      var template = Code.document.getElementById("ui-code");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
      
      var underlay = this.shadowRoot.getElementById("underlay");
      var context = underlay.getContext('2d');
      
      var range = document.createRange();
      var anchor;
      
      var isDragSelecting = false;
      
      var reposition = e => {
        underlay.style.top = this.scrollTop;
        underlay.style.left = this.scrollLeft;
        underlay.width = this.clientWidth;
        underlay.height = this.clientHeight;
      }
      
      this.addEventListener("scroll", reposition);
      this.addEventListener("onresize", reposition);
      
      this.addEventListener("mousedown", e => {
        anchor = document.caretRangeFromPoint(e.clientX, e.clientY);
        range.setStart(anchor.startContainer, anchor.startOffset);
        range.setEnd(anchor.endContainer, anchor.endOffset);
        isDragSelecting = true;
      });
      
      this.addEventListener("mousemove", e => {
        if (!isDragSelecting)
          return;
        // console.log("Mouse move! " + e.clientX + " " + e.clientY + " - " + range);
        var current = document.caretRangeFromPoint(e.clientX, e.clientY);
        // TODO: Or swap if selecting backwards!
        var cmp = anchor.compareBoundaryPoints(Range.START_TO_START, current);
        if (cmp <= 0) {
          range.setStart(anchor.startContainer, anchor.startOffset);
          range.setEnd(current.endContainer, current.endOffset);
        } else {
          range.setStart(current.endContainer, current.endOffset);
          range.setEnd(anchor.startContainer, anchor.startOffset);
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
      
      this.addEventListener("mouseup", e => {
        // console.log("Mouse up! " + e.clientX + " " + e.clientY);
        isDragSelecting = false;
      });
      
      this.addEventListener("click", e => {
        // Set carret on the clicked point.
        
      });
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

