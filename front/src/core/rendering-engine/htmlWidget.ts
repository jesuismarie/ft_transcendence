import {Widget} from "@/core/rendering-engine/widget";
import type {WidgetElement} from "@/core/rendering-engine/ElementWidget";
import {HtmlElement} from "@/core/rendering-engine/htmlElement";

export class HtmlWidget extends Widget {
    constructor(public htmlContent: string) {
        super();
    }

    createElement(): WidgetElement {
        return new HtmlElement(this);
    }
}