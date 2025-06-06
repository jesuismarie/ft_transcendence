import {MultiChildWidget} from "@/core/framework/widgets/multiChildWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {UniqueKey} from "@/core/framework/core/key";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";

export class Composite extends MultiChildWidget {
    constructor(children: Widget[], public parentId?: string, key: string = new UniqueKey().toString()) {
        super(children, parentId);
    }
    build(context: BuildContext): Widget {
        return this;
    }

}