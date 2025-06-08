import {StatelessElement, StatelessWidget} from "@/core/framework/widgets/statelessWidget";
// import {WidgetElement} from "@/core/framework/ElementWidget";
import {BuildContext} from "@/core/framework/core/buildContext";
import type {MultiChildWidget} from "@/core/framework/widgets/multiChildWidget";
import type {StatefulElement} from "@/core/framework/widgets/statefulWidget";
import {WidgetBinding} from "@/core/framework/core/widgetBinding";
import {UniqueKey} from "@/core/framework/core/key";
import {ErrorWidget, type WidgetElement} from "@/core/framework/renderer/ElementWidget";

export class MultiChildRenderer extends StatelessElement {
    constructor(widget: MultiChildWidget, public parentId?: string, key: string = new UniqueKey().toString()) {
        super(widget);
    }

    mount(parentDom: HTMLElement, context: BuildContext) {
        super.mount(parentDom, context);
        const widget = this.widget as MultiChildWidget;
        WidgetBinding.getInstance().postFrameCallback(() => {
            (this.widget as StatelessWidget).afterMounted(this.currentContext);
            for (const child of widget.children) {
                const element = child.createElement() as WidgetElement;
                element.parent = this;
                child.afterMounted(element.currentContext);
            }
        })
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {

        // const composite = document.createElement("my-composite");
        const template = document.createElement("my-widget");
        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;
        const parent = this.parentId ? mountPoint : parentDom;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }

        try {

            const widget = this.widget as MultiChildWidget;
            this.child = widget.createElement() as WidgetElement;

            for (const child of widget.children) {
                const element = child.createElement() as WidgetElement;
                const childContext = new BuildContext(element as StatefulElement);
                element.parent = this;
                element.mount(template, childContext);
            }
            const comp = parent?.querySelectorAll('my-widget');
            if (comp && comp.length > 0) {
                comp.forEach((e) => e.remove())
            }
            parent?.appendChild(template)

            return template;
        }
        catch (error) {
            console.error("Error in StatelessElement.render:", error);

            // Create ErrorWidget with error + stack
            const errorMessage = error instanceof Error
                ? `${error.message}\n${error.stack}`
                : String(error);

            const errorWidget = new ErrorWidget(errorMessage);
            this.child = errorWidget.createElement() as WidgetElement;
            this.child.parent = this;
            const parent = this.parentId ? mountPoint : parentDom;
            this.child.mount(template, new BuildContext(this.child));
            parent.appendChild(template);

            return template;
        }
    }

}