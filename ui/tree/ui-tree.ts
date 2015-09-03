module ui {
	@component("ui-tree")
	class Tree extends HTMLElement {
		static document: Document = document.currentScript.ownerDocument;
		private _selectedNode: Element;
		get selectedNode() { return this._selectedNode; }
		createdCallback() {
			var t = Tree.document.getElementById('ui-tree');
			var clone = document.importNode(t.content, true);
			var shadow = this.createShadowRoot();
			shadow.appendChild(clone);		
		}
		select(node: Node) {
			if (this._selectedNode) {
				this._selectedNode.removeAttribute("selected");
			}
			this._selectedNode = node;
			if (node) {
				node.setAttribute("selected", true);
			}
			
			var event = new Event("selection");
			this.dispatchEvent(event);
		}
	}
	
	@component("ui-node")
	class Node extends HTMLElement {
		static document: Document = document.currentScript.ownerDocument;
		createdCallback() {
			var t = Node.document.getElementById('ui-node');
			var clone = document.importNode(t.content, true);
			var shadow = this.createShadowRoot();
			shadow.appendChild(clone);
		
			// Apply template:
			var title = this.getAttribute('title');
			var titleElement = shadow.querySelector('#title');
			titleElement.innerHTML = title;
			
			// depth
			var depth = 0;
			var parent = this.parentNode;
			while(parent && !(parent instanceof Tree)) {
				if (parent instanceof Node) {
					depth++;
				}
				parent = parent.parentNode;
			}
			var headElement = shadow.querySelector("#head");
			headElement.style.padding = "0px 0px 0px " + (depth * 20) + "px";
			
			headElement.addEventListener("click", (e) => {
				console.log("Where: " + this);
				if (this.childNodes.length > 0) {
					if (this.getAttribute('collapsed')) {
						this.removeAttribute('collapsed');
					} else {
						this.setAttribute('collapsed', true);
					}
				} else {
					var tree = this;
					while(tree) {
						if (tree instanceof Tree) {
							tree.select(this);
							break;
						}
						tree = tree.parentNode;
					}
				}
				
				// Probably there is a better way to mark a node has been collapsed...
				e.stopPropagation();
			});
		}
	}
}
