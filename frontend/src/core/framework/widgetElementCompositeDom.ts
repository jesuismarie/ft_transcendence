import type {WidgetElementDom} from "@/core/framework/widgetElementDom";

export class WidgetElementCompositeDom extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        console.log(`<my-composite> connected to DOM`);
        // Optionally set up initial content or attach children
    }

    disconnectedCallback() {
        console.log(`<my-composite> removed from DOM`);
        // Cleanup logic if needed
    }

    setContent(content: WidgetElementDom | DocumentFragment | HTMLElement) {
        this.innerHTML = ''; // Clear previous content
        this.appendChild(content);
    }

}