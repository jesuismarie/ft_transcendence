import {Widget} from "./widget";
import {WidgetElement} from "@/core/rendering-engine/ElementWidget";
import {BuildContext} from "@/core/rendering-engine/buildContext";

export abstract class StatelessWidget extends Widget {
    createElement(): WidgetElement {
        return new StatelessElement(this);
    }

    abstract build(context: BuildContext): Widget;

    afterMounted(context: BuildContext): void {}
}

export class StatelessElement extends WidgetElement {

    constructor(widget: StatelessWidget) {
        super(widget);
        this.currentContext = new BuildContext(this);
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const builtWidget = (this.widget as StatelessWidget).build(context);
        this.child = builtWidget.createElement();

        // Create a container to hold the child
        const template = document.createElement("template");

        const cont = new BuildContext(this.child);
        this.child.parent = this;
        // Mount the child inside the container
        this.child.mount(parentDom, cont);

        Array.from(template.content.childNodes).forEach((node) => {
            parentDom.appendChild(node);
        });
        (this.widget as StatelessWidget).afterMounted(context);
        // Return the container as the rendered DOM
        return parentDom;
    }
}
