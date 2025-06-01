import {Widget} from "./widget";
import {WidgetElement} from "@/core/rendering-engine/ElementWidget";
import {BuildContext} from "@/core/rendering-engine/buildContext";

export abstract class StatefulWidget extends Widget {
    state?: State<StatefulWidget>;

    createElement(): WidgetElement {
        return new StatefulElement(this);
    }

    abstract createState(): State<StatefulWidget>;
}

export abstract class State<T extends StatefulWidget> {
    widget!: T;
    _element!: StatefulElement;

    abstract build(context: BuildContext): Widget;

    initState(context: BuildContext): void {}

    didUpdateWidget(oldWidget: Widget): void {
    }

    setState(cb: () => void): void {
        console.log("HHHHHHHH")
        cb();
        this._element.update(this.widget);
    }

    afterMounted(context: BuildContext): void {}
}

export class StatefulElement extends WidgetElement {
    state: State<StatefulWidget>;

    constructor(widget: StatefulWidget) {
        super(widget);
        this.state = widget.createState();
        this.state._element = this;
        this.state.widget = widget;
        this.currentContext = new BuildContext(this.state._element)
        this.state.initState(this.currentContext);
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const builtWidget = this.state.build(context);
        this.child = builtWidget.createElement();

        const template = document.createElement("template");
        const cont = new BuildContext(this.child);
        this.child.parent = this;
        this.child.mount(parentDom, cont);
        // parentDom.appendChild(template);
        Array.from(template.content.childNodes).forEach((node) => {
            parentDom.appendChild(node);
        });

        this.state.afterMounted(this.currentContext);
        return parentDom;
    }

    update(newWidget: Widget): void {
        const oldWidget = this.widget;
        this.widget = newWidget;
        this.state.widget = newWidget as StatefulWidget;
        this.state.didUpdateWidget(oldWidget);

        if (!this.dom) {
            this.dom = this.render(document.body, new BuildContext(this)); // or whatever root
        }

        while (this.dom.firstChild) {
            this.dom.removeChild(this.dom.firstChild);
        }

        // Rebuild the widget tree:
        const cont = new BuildContext(this);
        const newBuiltWidget = this.state.build(cont);
        this.child = newBuiltWidget.createElement();
        this.child.parent = this;
        // Mount the child inside the existing root container (this.dom)
        const context = new BuildContext(this.child)
        this.child.mount(this.dom, context);

        this.state.afterMounted(this.currentContext);
    }
}
