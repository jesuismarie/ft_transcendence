import {StatelessWidget} from "@/core/framework/statelessWidget";
import type {BuildContext} from "@/core/framework/buildContext";
import type {Widget} from "@/core/framework/widget";

export class Builder extends StatelessWidget {
    constructor(public child: Widget) {
        super();
    }
    build(context: BuildContext): Widget {
        return this.child;
    }

}