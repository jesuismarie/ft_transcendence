import {StatelessElement, StatelessWidget} from "@/core/framework/statelessWidget";
// import {WidgetElement} from "@/core/framework/ElementWidget";
import {BuildContext} from "@/core/framework/buildContext";
import type {MultiChildWidget} from "@/core/framework/multiChildWidget";
import type {StatefulElement} from "@/core/framework/statefulWidget";
import type {WidgetElement} from "@/core/framework/ElementWidget";
import {WidgetBinding} from "@/core/framework/widgetBinding";
import {UniqueKey} from "@/core/framework/key";

export class MultiChildRenderer extends StatelessElement {
    constructor(widget: MultiChildWidget, public parentId?: string, key: string = new UniqueKey().toString()) {
        super(widget);
    }
    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const widget = this.widget as MultiChildWidget;
        this.child = widget.createElement() as WidgetElement;
        // const composite = document.createElement("my-composite");
        const template = document.createElement("my-widget");
        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;
        const parent = this.parentId ? mountPoint : parentDom;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }
        for (const child of widget.children) {
            const element = child.createElement() as WidgetElement;
            const childContext = new BuildContext(element as StatefulElement);
            element.parent = this;
            element.mount(template, childContext);
        }
       parent?.appendChild(template)
        WidgetBinding.getInstance().postFrameCallback(() => {
            (this.widget as StatelessWidget).afterMounted(this.currentContext);
            for (const child of widget.children) {
                const element = child.createElement() as WidgetElement;
                element.parent = this;
                child.afterMounted(element.currentContext);
            }
        })
        return template;
    }

}