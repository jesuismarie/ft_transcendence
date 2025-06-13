import {BuildContext} from "@/core/framework/core/buildContext";
import {type IWidgetElement, Widget} from "@/core/framework/core/base";
import {waitForElement, WidgetBinding} from "@/core/framework/core/widgetBinding";
import {EventBindingManager} from "@/core/framework/core/listenersRegisty";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {ErrorWidget, WidgetElement} from "@/core/framework/renderer/ElementWidget";

export abstract class StatefulWidget extends Widget {
    state?: State<StatefulWidget>;

    _isMounted: boolean = false;

    createElement(): IWidgetElement {
        return new StatefulElement(this);
    }

    abstract createState(): State<StatefulWidget>;

    onMount(isMounted: boolean): void {
        this._isMounted = isMounted;
    }

    isMounted(): boolean {
        return this._isMounted;
    }
}

export abstract class State<T extends StatefulWidget> {
    widget!: T;
    _element!: StatefulElement;
    private _isMounted: boolean = false;

    abstract build(context: BuildContext): Widget;

    initState(context: BuildContext): void {}

    didUpdateWidget(oldWidget: Widget, context: BuildContext): void {
    }

    setState(cb: () => void): void {
        cb();
        this._element.markNeedsBuild();
        // this._element.update(this.widget);
    }
    didMounted(context: BuildContext): void {}


    dispose(): void {}

    onMount(isMounted: boolean): void {
        this._isMounted = isMounted
    }

    isMounted(): boolean {
        return this._isMounted;
    }

    afterMounted(context: BuildContext): void {}
}

export class StatefulElement extends WidgetElement {
    state: State<StatefulWidget>;
    stateInitialized: boolean = false;
    didMount: boolean = false;

    constructor(widget: StatefulWidget, public parentId?: string) {
        super(widget);
        this.state = widget.createState();
        this.state.widget = widget;
        this.state._element = this;
        this.currentContext = new BuildContext(this)
    }

    unmount() {
        super.unmount();
        this.state.onMount(false);
        // this.stateInitialized = false
        this.didMount = false;
        (this.widget as StatefulWidget).onMount(false);
    }

    async mount(parentDom: HTMLElement, context: BuildContext) {
        await super.mount(parentDom, context);

        WidgetBinding.getInstance().postFrameCallback(() => {
            this.state.onMount(true);
            this.state.afterMounted(this.currentContext);
            if (!this.didMount) {
                this.didMount = true;
                (this.widget as StatefulWidget).onMount(true);
                this.state.didMounted(this.currentContext);
                (this.widget as StatefulWidget).onMount(true);
            }
        })
    }

    async render(parentDom: HTMLElement, context: BuildContext): Promise<HTMLElement> {
        if (!this.stateInitialized) {
            this.stateInitialized = true;
            this.state.initState(this.currentContext)
        }
        const template = document.createElement("my-widget");
        if (this.parentId) {
            waitForElement(this.parentId).then(() => {
            })
        }
        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }
        try {
            const builtWidget = this.state.build(this.currentContext);
            this.child = builtWidget.createElement() as WidgetElement;
            this.child.parent = this;

            // Determine where to mount: element by id or fallback to parentDom


            const parent = this.parentId ? mountPoint : parentDom;
            await this.child.mount(template, new BuildContext(this.child));

            parent.appendChild(template);


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


    update(newWidget: Widget): void {
        const oldWidget = this.widget;
        this.widget = newWidget;
        this.state.widget = newWidget as StatefulWidget;
        this.state.didUpdateWidget(oldWidget, this.currentContext);

        this.markNeedsBuild(); // schedule rebuild instead of immediate manual update
    }
}
