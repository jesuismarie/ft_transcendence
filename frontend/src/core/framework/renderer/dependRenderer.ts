import {StatelessElement, StatelessWidget} from "@/core/framework/widgets/statelessWidget";
// import {WidgetElement} from "@/core/framework/ElementWidget";
import {BuildContext} from "@/core/framework/core/buildContext";
import type {MultiChildWidget} from "@/core/framework/widgets/multiChildWidget";
import type {StatefulElement} from "@/core/framework/widgets/statefulWidget";
import {waitForElement, WidgetBinding} from "@/core/framework/core/widgetBinding";
import {UniqueKey} from "@/core/framework/core/key";
import {ErrorWidget, type WidgetElement} from "@/core/framework/renderer/ElementWidget";
import type {DependWidget} from "@/core/framework/widgets/dependWidget";




export class DependRenderer extends StatelessElement {
    constructor(widget: DependWidget, public parentId?: string, key: string = new UniqueKey().toString()) {
        super(widget, parentId);
    }

   async mount(parentDom: HTMLElement, context: BuildContext) {
        this.dom = await this.render(parentDom, context);
    }

    async render(parentDom: HTMLElement, context: BuildContext): Promise<HTMLElement> {
        const template = document.createElement("my-widget");
        if (this.parentId) {
            await waitForElement(this.parentId)
        }
        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;
        const parent = this.parentId ? mountPoint : parentDom;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }

        try {

            const widget = this.widget as DependWidget;
            this.child = widget.createElement() as WidgetElement;

            for (const child of widget.params.dependWidgets) {
                const element = child.createElement() as WidgetElement;
                const childContext = new BuildContext(element);
                element.parent = this;
                await element.mount(template, childContext);
            }
            // const comp = parent?.querySelectorAll('my-widget');
            //
            // if (comp && comp.length > 0) {
            //     comp.forEach((e) => e.remove())
            // }
            // parent?.appendChild(template)
            parent?.appendChild(template)
            WidgetBinding.getInstance().postFrameCallback(async () => {
                for (const child of widget.params.children) {
                    const element = child.createElement() as WidgetElement;
                    const childContext = new BuildContext(element);
                    element.parent = this;
                    await element.mount(template, childContext);
                }

                widget.afterMounted?.(this.currentContext);
            });





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
           await this.child.mount(template, new BuildContext(this.child));
            parent.appendChild(template);

            return template;
        }
    }

}