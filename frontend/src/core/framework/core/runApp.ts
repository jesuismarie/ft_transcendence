import {BuildContext} from "@/core/framework/core/buildContext";
import {Widget} from "@/core/framework/core/base";
import {WidgetElementDom} from "@/core/framework/core/widgetElementDom";
import type {WidgetElement} from "@/core/framework/renderer/ElementWidget";

export function runApp(widget: Widget) {
    customElements.define('my-widget', WidgetElementDom);
    window.addEventListener("DOMContentLoaded", () => {
        const root = document.getElementById("root")!;
        const rootElement = widget.createElement();
        rootElement.mount(root, new BuildContext(rootElement as WidgetElement));
    });
}
