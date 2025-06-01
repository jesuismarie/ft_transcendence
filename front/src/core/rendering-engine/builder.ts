import {StatelessWidget} from "@/core/rendering-engine/statelessWidget";
import type {BuildContext} from "@/core/rendering-engine/buildContext";
import type {Widget} from "@/core/rendering-engine/widget";

export class Builder extends StatelessWidget {
    constructor(public child: Widget) {
        super();
    }
    build(context: BuildContext): Widget {
        return this.child;
    }

}