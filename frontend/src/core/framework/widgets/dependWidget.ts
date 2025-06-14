import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {MultiChildRenderer} from "@/core/framework/renderer/multiChildRenderer";
import type {Widget} from "@/core/framework/core/base";
import {UniqueKey} from "@/core/framework/core/key";
import type {WidgetElement} from "@/core/framework/renderer/ElementWidget";
import {DependRenderer} from "@/core/framework/renderer/dependRenderer";

export interface DependWidgetParams {
    children: Widget[],
    dependWidgets: Widget[],
    parentId?: string,
    key?: string
}

export abstract class DependWidget extends StatelessWidget {
    protected constructor(public params: DependWidgetParams) {
        super(params.key ?? new UniqueKey().toString());
    }

    createElement(): WidgetElement {
        return new DependRenderer(this, this.params.parentId);
    }

}