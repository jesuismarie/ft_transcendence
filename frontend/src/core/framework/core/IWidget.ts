import {type IWidgetElement, Widget} from "@/core/framework/core/base";
import {BuildContext} from "@/core/framework/core/buildContext";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";

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