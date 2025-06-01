import {WidgetElement} from "@/core/rendering-engine/ElementWidget";
import type {BuildContext} from "@/core/rendering-engine/buildContext";
import type {HtmlWidget} from "@/core/rendering-engine/htmlWidget";

export class HtmlElement extends WidgetElement {
    constructor(widget: HtmlWidget) {
        super(widget);
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        // context.logWidgetTree(context)
        const htmlWidget = this.widget as HtmlWidget;
        const template = document.createElement("template");
        template.innerHTML = htmlWidget.htmlContent.trim();

        Array.from(template.content.childNodes).forEach((node) => {
            parentDom.appendChild(node);
        });
        return parentDom;
    }
}
