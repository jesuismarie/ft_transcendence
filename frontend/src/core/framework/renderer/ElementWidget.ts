import {BuildContext} from "@/core/framework/core/buildContext";
import {type IWidgetElement, Widget} from "@/core/framework/core/base";
import {InheritedProvider} from "@/core/framework/providers/inheritedProvider";
import {WidgetBinding} from "@/core/framework/core/widgetBinding";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {StatefulWidget} from "@/core/framework/widgets/statefulWidget";

export abstract class WidgetElement implements IWidgetElement {
    widget: Widget;
    parent?: WidgetElement;
    child?: WidgetElement;
    currentContext!: BuildContext;

    dom?: HTMLElement;
    private _dirty = false;
    private _isMounted = false;
    private _isRebuilding = false;

    protected constructor(widget: Widget) {
        this.widget = widget;
    }



    mount(parentDom: HTMLElement, context: BuildContext) {
        // console.log(`RENDDDD::: ${parentDom.getAttribute('id')}`);
        this._isMounted = true;
        this.dom = this.render(parentDom, context);
    }

    public findInheritedProvider<T>(type: new (...args: any[]) => T): InheritedProviderElement<T> | null {
        let ancestor: WidgetElement | undefined = this.parent;
        while (ancestor) {
            if (ancestor instanceof InheritedProviderElement) {
                const provider = ancestor as InheritedProviderElement<T>;
                if (provider.widget.value instanceof type) {
                    return provider;
                }
            }
            ancestor = ancestor.parent;
        }
        return null;
    }

    markNeedsBuild() {
        if (this._dirty || !this._isMounted || this._isRebuilding) return;
        this._dirty = true;

        WidgetBinding.getInstance().postFrameCallback(() => {
            if (!this._dirty) return;  // Cancel if no longer dirty
            this._dirty = false;
            this._isRebuilding = true;

            const parent = this.dom?.parentElement;

            if (!parent || this.dom === document.body) {
                console.warn("Unsafe rebuild — this.dom may be pointing to <body> or detached node. Aborting rebuild.");
                this._isRebuilding = false;
                return; // Abort to avoid detaching the whole document body or unknown parent
            }

            // Remove current DOM subtree
            this.unmount();

            // Create a new BuildContext for this rebuild
            this.currentContext = new BuildContext(this);

            // Mount fresh DOM subtree
            this.mount(parent, this.currentContext);

            this._isRebuilding = false;
        });
    }


    update(newWidget: Widget): void {
        if (!this.widget.equals(newWidget)) {
            this.widget = newWidget;
            this.markNeedsBuild(); // just re-render without unmount
        } else {
            this.widget = newWidget;
        }
    }

    unmount(): void {
        this.dom?.remove();
        if (this.child) {
            this.child.unmount();
        }
        this._isMounted = false;
    }

    abstract render(parentDom: HTMLElement, context: BuildContext): HTMLElement;
}



export class InheritedProviderElement<T> extends WidgetElement {
    public widget: InheritedProvider<T>;
    private subscribers = new Set<() => void>();

    constructor(widget: InheritedProvider<T>) {
        super(widget);
        this.widget = widget;
    }

    update(newWidget: Widget): void {
        super.update(newWidget);
        this.widget = newWidget as InheritedProvider<T>;
        this.notifyDependents(); // Notify all
    }

    notifyDependents() {
        this.subscribers.forEach(callback => callback());
    }

    unmount() {
        super.unmount();
        this.child?.unmount();
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        // Build the child widget
        if (!this.widget.child) {
            return parentDom
        }
        console.log("HHHHHHH")
        this.child = this.widget.child.createElement() as WidgetElement;
        this.child.parent = this;
        this.child.mount(parentDom, new BuildContext(this.child));
        return this.child.dom!;
        // const childElement = this.widget.child.createElement() as WidgetElement;
        // return childElement.render(parentDom, context);

        // const childContext = new BuildContext(this);
        // let childElement: WidgetElement | null;
        // if (this.widget.child instanceof StatelessWidget) {
        //     const childWidget = (this.widget.child as StatelessWidget).build(context);
        //     childElement = childWidget.createElement() as WidgetElement;
        // }
        // else if (this.widget.child instanceof StatefulWidget) {
        //     const childWidget = (this.widget.child as StatefulWidget).state!.build(context);
        //     childElement = childWidget.createElement() as WidgetElement;
        // }
        // // Set up the element tree
        // this.child = childElement!;
        // this.child.parent = this;
        // this.child.mount(parentDom, childContext);
        // WidgetBinding.getInstance().postFrameCallback(() => {
        //     this.widget.afterMounted(this.currentContext);
        //     if (!this.stateInitialized) {
        //         this.stateInitialized = true;
        //         (this.widget as StatelessWidget).didMounted(context);
        //     }
        // })
        // return this.child.dom!;
    }

    subscribe(callback: () => void) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    getValue(): T {
        return this.widget.value;
    }

    build(): Widget {
        return this.widget.child!;
    }
}
