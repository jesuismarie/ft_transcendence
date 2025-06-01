import { Widget } from "./widget";
import {BuildContext} from "@/core/rendering-engine/buildContext";

export function runApp(widget: Widget) {
    window.addEventListener("DOMContentLoaded", () => {
        const root = document.getElementById("root")!;
        const rootElement = widget.createElement();
        rootElement.mount(root, new BuildContext(rootElement));
    });
}
