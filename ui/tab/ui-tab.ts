module ui {
	@component("ui-tabbar")
	class TabBar extends HTMLElement {
		static document: Document = document.currentScript.ownerDocument;
		createdCallback() {
			var t = <Template>TabBar.document.getElementById("ui-tabbar");
			var clone = document.importNode(t.content, true);
			var shadow = this.createShadowRoot();
			shadow.appendChild(clone);
		}
	
		select(item:Tab) {
			for (var i = 0; i < this.childNodes.length; i++) {
				var child = this.childNodes[i];
				if (child instanceof Tab) {
					child.removeAttribute("selected");
				}
			}
			item.setAttribute("selected", true.toString());
		}
	}
	
	@component("ui-tab")
	class Tab extends HTMLElement {
		static document: Document = document.currentScript.ownerDocument;
		createdCallback() {

			var t = <Template>Tab.document.getElementById("ui-tab");
			var clone = document.importNode(t.content, true);
			var shadow = this.createShadowRoot();
			shadow.appendChild(clone);

			this.addEventListener("click", function() {
				this.parentNode.select(this);
			});
		}	
	}
}