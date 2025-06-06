import type {BuildContext} from "@/core/framework/core/buildContext";
import type {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {WidgetBinding} from "@/core/framework/core/widgetBinding";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {WidgetElement} from "@/core/framework/renderer/ElementWidget";

export class HtmlElement extends WidgetElement {
    constructor(widget: HtmlWidget, public parentId?: string) {
        super(widget);
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const htmlWidget = this.widget as HtmlWidget;
        const template = document.createElement("my-widget");

        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }
        const parent = this.parentId ? mountPoint : parentDom;
        const comp = parent?.querySelectorAll('my-widget');
        if (comp && comp.length > 0) {
            comp.forEach((e) => e.remove())
        }
        template.innerHTML = htmlWidget.htmlContent.trim();
        parent.appendChild(template);

        WidgetBinding.getInstance().postFrameCallback(() => {
            (this.widget as HtmlWidget).afterMounted(this.currentContext);
        })
        return template; // Return where you appended content
    }
}
