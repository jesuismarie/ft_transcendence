import type { Widget } from "./widget";
import type {WidgetElement} from "@/core/rendering-engine/ElementWidget";
import {StatefulElement} from "@/core/rendering-engine/statefulWidget";
import  {NavigatorState} from "@/core/rendering-engine/navigator";

export class BuildContext {
    element: WidgetElement;

    constructor(element: WidgetElement) {
        this.element = element;
    }

    get widget(): Widget {
        return this.element.widget;
    }

    logWidgetTree(context: BuildContext) {
        let current: WidgetElement | undefined = context.element;
        while (current) {
            console.log(current.widget.constructor.name);
            current = current.parent;
        }
    }

    /// Finds the closest ancestor widget of the given type
    findAncestorOfExactType<T extends Widget>(type: new (...args: any[]) => T): T | undefined {
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

    navigator(): NavigatorState {
        let current: WidgetElement | undefined = this.element;

        while (current) {
            if (current instanceof StatefulElement && current.state instanceof NavigatorState) {
                return current.state;
            }
            current = current.parent;
        }

        throw new Error("Navigator not found in widget tree.");
    }
}
