module ui {
  @component("ui-code")
  class Code extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    
    range: any;
    underlay: any;
    context: any;
    
    createdCallback() {
      var root = this.createShadowRoot();
      var template = Code.document.getElementById("ui-code");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
      
      this.underlay = this.shadowRoot.getElementById("underlay");
      this.context = this.underlay.getContext('2d');
      
      this.range = document.createRange();
      var anchor;
      
      var isDragSelecting = false;
      
      var reposition = e => {
        this.underlay.style.top = this.scrollTop;
        this.underlay.style.left = this.scrollLeft;
        this.underlay.width = this.clientWidth;
        this.underlay.height = this.clientHeight;
      }
      
      this.addEventListener("scroll", reposition);
      this.addEventListener("onresize", reposition);
      
      this.addEventListener("mousedown", e => {
        anchor = document.caretRangeFromPoint(e.clientX, e.clientY);
        this.range.setStart(anchor.startContainer, anchor.startOffset);
        this.range.setEnd(anchor.endContainer, anchor.endOffset);
        isDragSelecting = true;
        
        this.reselect();
      });
      
      this.addEventListener("mousemove", e => {
        if (!isDragSelecting)
          return;
         // console.log("Mouse move! " + e.clientX + " " + e.clientY + " - " + range);
        var current = document.caretRangeFromPoint(e.clientX, e.clientY);
        // TODO: Or swap if selecting backwards!
        var cmp = anchor.compareBoundaryPoints(Range.START_TO_START, current);
        if (cmp <= 0) {
          this.range.setStart(anchor.startContainer, anchor.startOffset);
          this.range.setEnd(current.endContainer, current.endOffset);
        } else {
          this.range.setStart(current.endContainer, current.endOffset);
          this.range.setEnd(anchor.startContainer, anchor.startOffset);
        }
        
        this.reselect();
      });
      
      this.addEventListener("mouseup", e => {
        // console.log("Mouse up! " + e.clientX + " " + e.clientY);
        isDragSelecting = false;
      });
      
      this.addEventListener("click", e => {
        // Set carret on the clicked point.
        
      });
    }
    
    reselect() {        
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
            
            var lineRect = {
              left: ranges[0].left,
              top: ranges[0].top,
              right: ranges[ranges.length - 1].right,
              bottom: ranges[ranges.length - 1].bottom
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

