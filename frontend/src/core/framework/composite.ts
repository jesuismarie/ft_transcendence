import {MultiChildWidget} from "@/core/framework/multiChildWidget";
import type {BuildContext} from "@/core/framework/buildContext";
import type {Widget} from "@/core/framework/base";
import {UniqueKey} from "@/core/framework/key";
import {EmptyWidget} from "@/core/framework/emptyWidget";

export class Composite extends MultiChildWidget {
    constructor(children: Widget[], public parentId?: string, key: string = new UniqueKey().toString()) {
        super(children, parentId);
    }
    build(context: BuildContext): Widget {
        return this;
    }

}