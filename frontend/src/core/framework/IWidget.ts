import {type IWidgetElement, Widget} from "@/core/framework/base";
import {BuildContext} from "@/core/framework/buildContext";
import {EmptyWidget} from "@/core/framework/emptyWidget";

export abstract class IWidget extends Widget {
    abstract createElement(): IWidgetElement;

    equals(other: Widget | null | undefined): boolean {
        return !!other && this.constructor === other.constructor;
    }
    afterMounted(context: BuildContext): void {}

    build(context: BuildContext): Widget {
        return new EmptyWidget()
    }
}