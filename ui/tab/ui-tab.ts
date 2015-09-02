module ui {
	@component("ui-tabbar")
	class TabBar extends HTMLElement {
		static document: Document = document.currentScript.ownerDocument;
		createdCallback() {
			var t = TabBar.document.getElementById("ui-tabbar");
			var clone = document.importNode(t.content, true);
			var shadow = this.createShadowRoot();
			shadow.appendChild(clone);
		}
	
		select(item) {
			for (var i = 0; i < this.childNodes.length; i++) {
				var child = this.childNodes[i];
				if (child instanceof Tab) {
					child.removeAttribute("selected");
				}
			}
			item.setAttribute("selected", true);
		}
	}
	
	@component("ui-tab")
	class Tab extends HTMLElement {
		static document: Document = document.currentScript.ownerDocument;
		createdCallback() {

			var t = Tab.document.getElementById("ui-tab");
			var clone = document.importNode(t.content, true);
			var shadow = this.createShadowRoot();
			shadow.appendChild(clone);

			this.addEventListener("click", function() {
				this.parentNode.select(this);
			});
		}	
	}
}