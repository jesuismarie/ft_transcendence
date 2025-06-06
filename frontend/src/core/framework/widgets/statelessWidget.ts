import {BuildContext} from "@/core/framework/core/buildContext";
import {type IWidgetElement, Widget} from "@/core/framework/core/base";
import {WidgetBinding} from "@/core/framework/core/widgetBinding";
import {WidgetElement} from "@/core/framework/renderer/ElementWidget";

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

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const template = document.createElement("my-widget");
        const builtWidget = (this.widget as StatelessWidget).build(this.currentContext);
        this.child = builtWidget.createElement() as WidgetElement;
        this.child.parent = this;

        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }

        const parent = this.parentId ? mountPoint : parentDom;
        this.child.mount(template, new BuildContext(this.child));
        parent.appendChild(template)
        WidgetBinding.getInstance().postFrameCallback(() => {
            (this.widget as StatelessWidget).afterMounted(this.currentContext);
            if (!this.stateInitialized) {
                this.stateInitialized = true;
                (this.widget as StatelessWidget).didMounted(context);
            }
        })
        // const widget = this.widget as StatelessWidget;
        // widget.afterMounted(context);
        // (this.widget as StatelessWidget).afterMounted(context);
        return template; // Important: return where you actually mounted
    }

    unmount() {
        super.unmount();
        this.stateInitialized = false;
    }
}
