import {BuildContext} from "@/core/framework/core/buildContext";
import {type IWidgetElement, Widget} from "@/core/framework/core/base";
import {WidgetBinding} from "@/core/framework/core/widgetBinding";
import {ErrorWidget, WidgetElement} from "@/core/framework/renderer/ElementWidget";

export abstract class StatelessWidget extends Widget {
    createElement(): IWidgetElement {
        return new StatelessElement(this);
    }

    abstract build(context: BuildContext): Widget;

    afterMounted(context: BuildContext): void {}
    didMounted(context: BuildContext): void {}
}

export class StatelessElement extends WidgetElement {

    stateInitialized: boolean = false;
    constructor(widget: StatelessWidget, public parentId?: string) {
        super(widget);
        this.currentContext = new BuildContext(this);
    }

    mount(parentDom: HTMLElement, context: BuildContext) {
        super.mount(parentDom, context);
        WidgetBinding.getInstance().postFrameCallback(() => {
            (this.widget as StatelessWidget).afterMounted(this.currentContext);
            if (!this.stateInitialized) {
                this.stateInitialized = true;
                (this.widget as StatelessWidget).didMounted(context);
            }
        })
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const template = document.createElement("my-widget");
        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }

        try {
            const builtWidget = (this.widget as StatelessWidget).build(this.currentContext);
            this.child = builtWidget.createElement() as WidgetElement;
            this.child.parent = this;


            const parent = this.parentId ? mountPoint : parentDom;
            this.child.mount(template, new BuildContext(this.child));
            parent.appendChild(template)

            // const widget = this.widget as StatelessWidget;
            // widget.afterMounted(context);
            // (this.widget as StatelessWidget).afterMounted(context);
            return template; // Important: return where you actually mounted
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

    unmount() {
        super.unmount();
        this.stateInitialized = false;
    }
}
