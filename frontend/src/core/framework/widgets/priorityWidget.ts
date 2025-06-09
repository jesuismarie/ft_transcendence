import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {Composite} from "@/core/framework/widgets/composite";

export class PriorityWidget extends  StatelessWidget {
    constructor(public child: Widget, public priorityWidget: Widget) {
        super();
    }



    build(context: BuildContext): Widget {
        if (this.priorityWidget.isMounted()) {
            return new Composite([this.priorityWidget, this.child]);
        }
        while (!this.priorityWidget.isMounted()) {}
        return new Composite([this.priorityWidget, this.child]);
    }
}