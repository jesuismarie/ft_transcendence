export class WidgetElementDom extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // console.log(`<my-widget> connected to DOM`);
        // Optionally set up initial content or attach children
    }

    disconnectedCallback() {
        // console.log(`<my-widget> removed from DOM`);
        // Cleanup logic if needed
    }

    setContent(content: HTMLElement | DocumentFragment) {
        this.innerHTML = ''; // Clear previous content
        this.appendChild(content);
    }
}

// Define the custom tag (only once!)
