import {StatelessWidget} from "@/core/framework/statelessWidget";
import type {WidgetElement} from "@/core/framework/ElementWidget";
import {MultiChildRenderer} from "@/core/framework/multiChildRenderer";
import type {Widget} from "@/core/framework/base";
import {UniqueKey} from "@/core/framework/key";

export abstract class MultiChildWidget extends StatelessWidget {
    protected constructor(public children: Widget[], public parentId?: string, public key: string = new UniqueKey().toString()) {
        super(key);
    }

    createElement(): WidgetElement {
        return new MultiChildRenderer(this, this.parentId);
    }

}