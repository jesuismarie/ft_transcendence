import type {WidgetElement} from "@/core/rendering-engine/ElementWidget";

export abstract class Widget {
    abstract createElement(): WidgetElement;

    equals(other: Widget | null | undefined): boolean {
        return !!other && this.constructor === other.constructor;
    }
}
