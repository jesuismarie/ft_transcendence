// import {InheritedProviderElement} from "@/core/framework/inheritedProviderElement";
import type {IBuildContext, Widget} from "@/core/framework/base";
import type {WidgetElement} from "@/core/framework/ElementWidget";

export class BuildContext implements IBuildContext{
    element: WidgetElement;

    constructor(element: WidgetElement) {
        this.element = element;
    }

    get widget(): Widget {
        return this.element.widget;
    }




    read<T>(type: new (...args: any[]) => T): T {
        const provider = this.element.findInheritedProvider<T>(type);
        if (!provider) throw new Error(`No provider found for type ${type}`);
        return provider.getValue();
    }

    watch<T>(type: new (...args: any[]) => T): T {
        const provider = this.element.findInheritedProvider<T>(type);
        if (!provider) throw new Error(`No provider found for type ${type}`);

        const element = this.element;

        // Subscribe to rebuild this widget
        provider.subscribe(() => {
            element.markNeedsBuild?.(); // You must ensure this exists on StatefulElement
        });

        return provider.getValue();
    }

    logWidgetTree(context: BuildContext) {
        let current: WidgetElement | undefined = context.element;
        while (current) {
            console.log(current.widget.constructor.name);
            current = current.parent;
        }
    }

    /// Finds the closest ancestor widget of the given type
    public findAncestorOfExactType<T extends Widget>(type: new (...args: any[]) => T): T | undefined {
        let parent = this.element.parent;
        while (parent) {
            if (parent.widget instanceof type) {
                return parent.widget as T;
            }
            parent = parent.parent;
        }
        return undefined;
    }

    appendIfNotContains(child: WidgetElement): void {
        if (!this.element.dom || !child.dom) return;
        if (!this.element.dom.contains(child.dom)) {
            this.element.dom.appendChild(child.dom);
        }
    }

    replaceChild(oldChild: WidgetElement, newChild: WidgetElement): void {
        if (this.element.dom && oldChild.dom && newChild.dom) {
            this.element.dom.replaceChild(newChild.dom, oldChild.dom);
        }
    }
    //
}
