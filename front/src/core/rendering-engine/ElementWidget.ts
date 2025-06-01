import {BuildContext} from "@/core/rendering-engine/buildContext";
import type {Widget} from "@/core/rendering-engine/widget";

export abstract class WidgetElement {
    widget: Widget;
    parent?: WidgetElement;
    child?: WidgetElement;
    currentContext!: BuildContext;

    dom?: HTMLElement;

    protected constructor(widget: Widget) {
        this.widget = widget;
    }

    mount(parentDom: HTMLElement, context: BuildContext) {
        // console.log(`RENDDDD::: ${parentDom.getAttribute('id')}`);
        this.dom = this.render(parentDom, context);
    }

    update(newWidget: Widget): void {
        if (!this.widget.equals(newWidget)) {
            this.unmount();
            this.widget = newWidget;
            this.currentContext = new BuildContext(this);

            this.mount(this.dom!.parentElement!, this.currentContext);
        } else {
            this.widget = newWidget;
        }
    }

    unmount(): void {
        this.dom?.remove();
        if (this.child) {
            this.child.unmount();
        }
    }

    abstract render(parentDom: HTMLElement, context: BuildContext): HTMLElement;
}