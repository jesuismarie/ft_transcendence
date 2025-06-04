import type {BuildContext} from "@/core/framework/buildContext";
import {EmptyWidget} from "@/core/framework/emptyWidget";
import {Widget} from "@/core/framework/base";
import {State, StatefulWidget} from "@/core/framework/statefulWidget";
import {UniqueKey} from "@/core/framework/key";

export class MountAwareComposite extends StatefulWidget {
    constructor(
        private readonly builder: (context: BuildContext) => Widget,
        private readonly parentId?: string,
        public key: string = new UniqueKey().toString()
    ) {
        super(key);
    }

    createState(): State<MountAwareComposite> {
        return new MountAwareCompositeState(this.builder);
    }
}

class MountAwareCompositeState extends State<MountAwareComposite> {
    private mounted = false;

    constructor(
        private readonly builder: (context: BuildContext) => Widget
    ) {
        super();
    }

    build(context: BuildContext): Widget {
        if (!this.mounted) {
            this.mounted = true;
            this.setState(() => {});
            return new EmptyWidget();
        }

        return this.builder(context);
    }
}
