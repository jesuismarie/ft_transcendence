import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {MultiChildRenderer} from "@/core/framework/renderer/multiChildRenderer";
import type {Widget} from "@/core/framework/core/base";
import {UniqueKey} from "@/core/framework/core/key";
import type {WidgetElement} from "@/core/framework/renderer/ElementWidget";

export abstract class MultiChildWidget extends StatelessWidget {
    protected constructor(public children: Widget[], public parentId?: string, public key: string = new UniqueKey().toString()) {
        super(key);
    }

    createElement(): WidgetElement {
        return new MultiChildRenderer(this, this.parentId);
    }

}