module ui {
  @component("ui-window")
  class Window extends HTMLElement {
    static document: Document = document.currentScript.ownerDocument;
    createdCallback() {
      var root = this.createShadowRoot();
      var template = <Template>Window.document.getElementById("ui-window");
      var clone = document.importNode(template.content, true);
      root.appendChild(clone);
    }
  }
}

