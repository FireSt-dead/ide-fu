module ui {
  @component("ui-code")
  class Code extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    createdCallback() {
      var root = this.createShadowRoot();
      var template = Code.document.getElementById("ui-code");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
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

