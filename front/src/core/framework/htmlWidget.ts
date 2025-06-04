import type {WidgetElement} from "@/core/framework/ElementWidget";
import {HtmlElement} from "@/core/framework/htmlElement";
import {Widget} from "@/core/framework/base";
import {BuildContext} from "@/core/framework/buildContext";
import {UniqueKey} from "@/core/framework/key";

export class HtmlWidget extends Widget {
    constructor(public htmlContent: string, public parentId?: string, public key: string = new UniqueKey().toString()) {
        super(key);
    }

    createElement(): WidgetElement {
        return new HtmlElement(this, this.parentId);
    }
    afterMounted(context: BuildContext): void {}
}