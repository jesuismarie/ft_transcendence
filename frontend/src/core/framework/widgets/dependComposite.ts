import {MultiChildWidget} from "@/core/framework/widgets/multiChildWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {UniqueKey} from "@/core/framework/core/key";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";
import {DependWidget} from "@/core/framework/widgets/dependWidget";

export interface DependCompositeWidgetParams {
    children: Widget[],
    dependWidgets: Widget[],
    parentId?: string,
    key?: string
}

export class DependComposite extends DependWidget {
    constructor(public params: DependCompositeWidgetParams) {
        super({children: params.children, dependWidgets: params.dependWidgets, parentId: params.parentId, key: params.key ?? new UniqueKey().toString()});
    }
    build(context: BuildContext): Widget {
        return this;
    }

}