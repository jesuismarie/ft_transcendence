export class WidgetElementDom extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
    }

    disconnectedCallback() {
    }

    setContent(content: HTMLElement | DocumentFragment) {
        this.innerHTML = ''; // Clear previous content
        this.appendChild(content);
    }
}

// Define the custom tag (only once!)
