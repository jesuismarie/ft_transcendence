import {BuildContext} from "@/core/framework/buildContext";
import {Widget} from "@/core/framework/base";
import type {WidgetElement} from "@/core/framework/ElementWidget";
import {WidgetElementDom} from "@/core/framework/widgetElementDom";

export function runApp(widget: Widget) {
    customElements.define('my-widget', WidgetElementDom);
    window.addEventListener("DOMContentLoaded", () => {
        const root = document.getElementById("root")!;
        const rootElement = widget.createElement();
        rootElement.mount(root, new BuildContext(rootElement as WidgetElement));
    });
}
