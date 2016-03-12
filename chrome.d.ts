// declare function alert(message: string): void;

// declare class Node {
// 	appendChild(child: Node): void;
// }

// declare class Event {
// 	constructor(name: string);
//     preventDefault(): void;
// }

// declare class Element extends Node {
// 	childNodes: Element[];
// 	content: any;

// 	innerHTML: string;
// 	textContent: string;
    
//     ondragover: (e: Event) => boolean;
//     ondrop: (e: Event) => boolean; 
	
// 	querySelector(selector: string): Element;
	
// 	removeAttribute(attribute: string): void;
// 	setAttribute(attribute: string, value: any): void;
	
// 	addEventListener(type: string, callback: Function): void;
// 	removeEventListener(type: string, callback: Function): void;
// 	dispatchEvent(event: Event): void;
// }

// declare class ShadowRoot extends Node {
// }

// declare class Window extends Element {
// }
// declare var window: Window;

// declare class Document extends Element {
// 	currentScript:Script;
// 	registerElement(name: string, options: { prototype?: {}}): void;
// 	importNode(externalNode: Element, deep: boolean): Node;
// 	getElementById(name: string): Element;
// }
// declare var document: Document;

// declare class HTMLElement extends Element {
// 	protected createdCallback(): void;
// 	protected createShadowRoot(): ShadowRoot;
// }

// declare class Script {
// 	ownerDocument: Document;
// }

interface HTMLElement {
    shadowRoot: ShadowRoot;
}

interface ShadowRoot extends HTMLElement {
    // Is this document?
    /**
     * Returns a reference to the first object with the specified value of the ID or NAME attribute.
     * @param elementId String that specifies the ID value. Case-insensitive.
     */
    getElementById(elementId: string): HTMLElement;
}

interface Template extends HTMLElement {
    content: Node;
}

interface Range {
    intersectsNode(node: Node): boolean;
}

interface Document {
    currentScript: { ownerDocument: Document };
    registerElement(name: string, options: { prototype?: {}}): void;
    caretRangeFromPoint(x: number, y: number): Range;
}

interface HTMLElement {
    createdCallback(): void;
	createShadowRoot(): ShadowRoot;
}

// TODO: Move to separate file
declare function component(name: string): ClassDecorator;
declare function parentOfType(node: Node, type: any): Node;
