import {BuildContext} from "@/core/framework/core/buildContext";
import {UniqueKey} from "@/core/framework/core/key";

export type WidgetKey = string | undefined;

export abstract class Widget {
    constructor(public key: WidgetKey = new UniqueKey().toString()) {}

    abstract createElement(): IWidgetElement;

    equals(other: Widget | null | undefined): boolean {
        return !!other && this.constructor === other.constructor;
    }

    afterMounted(context: BuildContext): void {
    }

    isMounted(): boolean {
        return false;
    }
}

export interface IBuildContext {

    read<T>(type: new (...args: any[]) => T): T;

    watch<T>(type: new (...args: any[]) => T): T;

    logWidgetTree(context: IBuildContext): void;

    findAncestorOfExactType<T extends Widget>(type: new (...args: any[]) => T): T | undefined;

    appendIfNotContains(child: IWidgetElement): void;

    replaceChild(oldChild: IWidgetElement, newChild: IWidgetElement): void;

}


export interface IWidgetElement {
    update(newWidget: Widget): void;

    markNeedsBuild(): void;

    unmount(): void;

    mount(parentDom: HTMLElement, context: IBuildContext): void;
}
