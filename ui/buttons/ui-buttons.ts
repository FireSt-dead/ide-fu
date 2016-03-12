module ui {
  @component("ui-button")
  class Button extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    createdCallback() {
      var root = this.createShadowRoot();
      var template = <Template>Button.document.querySelector('#ui-button');
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
    }
  }
  
  @component("ui-check-box")
  class CheckBox extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    createdCallback() {
      var root = this.createShadowRoot();
      var template = <Template>CheckBox.document.querySelector('#ui-check-box');
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
      
      this.addEventListener('click', toggle);
      this.addEventListener('keyup', function(e) {
        if (e.keyCode == 32) {
          toggle.call(this);
        }
      });
      
      function toggle() {
        if (this.getAttribute('checked')) {
          this.removeAttribute("checked");
        } else {
          this.setAttribute("checked", true);
        }
      }
    }
  }
  
  @component("ui-radio-button")
  class RadioButton extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    createdCallback() {
      var root = this.createShadowRoot();
      var template = <Template>RadioButton.document.querySelector('#ui-radio-button');
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
      
      this.addEventListener('click', toggle);
      this.addEventListener('keyup', function(e) {
        if (e.keyCode == 32) {
          toggle.call(this);
        }
      });
      
      function toggle() {
        if (this.getAttribute('checked')) {
          this.removeAttribute("checked");
        } else {
          this.setAttribute("checked", true);
        }
      }
    }
  } 
}