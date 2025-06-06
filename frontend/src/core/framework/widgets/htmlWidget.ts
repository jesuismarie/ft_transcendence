import {HtmlElement} from "@/core/framework/renderer/htmlElement";
import {Widget} from "@/core/framework/core/base";
import {BuildContext} from "@/core/framework/core/buildContext";
import {UniqueKey} from "@/core/framework/core/key";
import type {WidgetElement} from "@/core/framework/renderer/ElementWidget";

export class HtmlWidget extends Widget {
    constructor(public htmlContent: string, public parentId?: string, public key: string = new UniqueKey().toString()) {
        super(key);
    }

    createElement(): WidgetElement {
        return new HtmlElement(this, this.parentId);
    }
    afterMounted(context: BuildContext): void {}
}