import {Widget} from "@/core/framework/widget";
import type {WidgetElement} from "@/core/framework/ElementWidget";
import {HtmlElement} from "@/core/framework/htmlElement";

export class HtmlWidget extends Widget {
    constructor(public htmlContent: string) {
        super();
    }

    createElement(): WidgetElement {
        return new HtmlElement(this);
    }
}