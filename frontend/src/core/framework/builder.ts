import {State, StatefulWidget} from "@/core/framework/statefulWidget";
import type {BuildContext} from "@/core/framework/buildContext";
import type {ValueListenable} from "@/core/framework/valueListenable";
import type {Widget} from "@/core/framework/base";
import {UniqueKey} from "@/core/framework/key";

export class Builder<T> extends StatefulWidget {
    constructor(
        public valueListenable: ValueListenable<T>,
        public builder: (context: BuildContext, value: T) => Widget,
        public key?: string,
    ) {
        super(key);
    }

    createState(): State<Builder<T>> {
        return new BuilderState<T>();
    }
}

export class BuilderState<T> extends State<Builder<T>> {
    private listener = () => this.setState(() => {});

    initState(context: BuildContext): void {
        this.widget.valueListenable.addListener(this.listener);
    }

    build(context: BuildContext): Widget {
        return this.widget.builder(context, this.widget.valueListenable.value);
    }

    dispose(): void {
        this.widget.valueListenable.removeListener(this.listener);
    }

    didUpdateWidget(oldWidget: Builder<T>): void {
        if (oldWidget.valueListenable !== this.widget.valueListenable) {
            oldWidget.valueListenable.removeListener(this.listener);
            this.widget.valueListenable.addListener(this.listener);
        }
    }
}

