import { StatefulWidget, State } from "@/core/framework/statefulWidget";
import type {BlocBase} from "@/core/framework/blocBase";
import type {BuildContext} from "@/core/framework/buildContext";
import {BlocProvider} from "@/core/framework/blocProvider";
import type {BlocSubscription} from "@/core/framework/blocSubscription";
import {EmptyWidget} from "@/core/framework/emptyWidget";
import type {Widget} from "@/core/framework/base";
import type {Equatable} from "@/core/framework/equatable";

export interface BlocListenerProps<B extends BlocBase<S>, S extends Equatable<S>> {
    bloc?: B;
    blocType?: new (...args: any[]) => B;
    listener: (context: BuildContext, state: S) => void;
    child?: Widget;
}

export class BlocListener<B extends BlocBase<S>, S extends Equatable<S>> extends StatefulWidget {
    readonly bloc?: B;
    readonly blocType?: new (...args: any[]) => B;
    readonly listener: (context: BuildContext, state: S) => void;
    readonly child?: Widget;

    constructor(props: BlocListenerProps<B, S>) {
        super();
        this.bloc = props.bloc;
        this.blocType = props.blocType;
        this.listener = props.listener;
        this.child = props.child;
    }

    createState(): State<BlocListener<B, S>> {
        return new _BlocListenerState<B, S>();
    }
}

class _BlocListenerState<B extends BlocBase<S>, S extends Equatable<S>> extends State<BlocListener<B, S>> {
    private subscription?: BlocSubscription;
    private bloc!: B;

    initState(context: BuildContext): void {
        super.initState(context);


    }

    dispose(): void {
        this.subscription?.unsubscribe();
        super.dispose();
    }

    build(context: BuildContext): Widget {
        if (this.widget.bloc) {
            this.bloc = this.widget.bloc;
        } else if (this.widget.blocType) {
            this.bloc = BlocProvider.of<B>(context, this.widget.blocType);
        } else {
            throw new Error("BlocListener requires either bloc or blocType.");
        }

        this.subscription = this.bloc.subscribe((state: S) => {
            this.widget.listener(context, state);
        });
        return this.widget.child ?? new EmptyWidget(); // or return some default empty widget
    }
}
