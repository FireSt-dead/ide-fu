declare function alert(message: string): void;

declare class Node {
	appendChild(child: Node): void;
}

declare class Event {
	constructor(name: string);
}

declare class Element extends Node {
	childNodes: Element[];
	content: any;

	innerHTML: string;
	textContent: string;
	
	querySelector(selector: string): Element;
	
	removeAttribute(attribute: string): void;
	setAttribute(attribute: string, value: any): void;
	
	addEventListener(type: string, callback: Function): void;
	removeEventListener(type: string, callback: Function): void;
	dispatchEvent(event: Event): void;
}

declare class ShadowRoot extends Node {
}

declare class Window extends Element {	
}
declare var window: Window;

declare class Document extends Element {
	currentScript:Script;
	registerElement(name: string, options: { prototype?: {}}): void;
	importNode(externalNode: Element, deep: boolean): Node;
	getElementById(name: string): Element;
}
declare var document: Document;

declare class HTMLElement extends Element {
	protected createdCallback(): void;
	protected createShadowRoot(): ShadowRoot;
}

declare class Script {
	ownerDocument: Document;
}

