import {BuildContext} from "@/core/framework/buildContext";
import {type IWidgetElement, Widget} from "@/core/framework/base";
import {InheritedProvider} from "@/core/framework/inheritedProvider";
import {WidgetBinding} from "@/core/framework/widgetBinding";

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

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        // Build the child widget
        if (!this.widget.child) {
            return parentDom
        }
        const childContext = new BuildContext(this);
        const childElement = this.widget.child.createElement() as WidgetElement;

        // Set up the element tree
        this.child = childElement;
        childElement.parent = this;
        childElement.mount(parentDom, childContext);
        WidgetBinding.getInstance().postFrameCallback(() => {
            this.widget.afterMounted(this.currentContext);
        })
        return childElement.dom!;
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
