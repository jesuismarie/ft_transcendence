import { StatefulWidget, State } from "@/core/framework/widgets/statefulWidget";
import type {BlocBase} from "@/core/framework/bloc/blocBase";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import type {BlocSubscription} from "@/core/framework/bloc/blocSubscription";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";
import type {Widget} from "@/core/framework/core/base";
import type {Equatable} from "@/core/framework/core/equatable";

export interface BlocListenerProps<B extends BlocBase<S>, S extends Equatable<S>> {
    bloc?: B;
    blocType?: new (...args: any[]) => B;
    listener: (context: BuildContext, state: S) => void;
    listenWhen?: (oldState: S, state: S) => void;
    child?: Widget;
}

export class BlocListener<B extends BlocBase<S>, S extends Equatable<S>> extends StatefulWidget {
    readonly bloc?: B;
    readonly blocType?: new (...args: any[]) => B;
    readonly listenWhen?: (oldState: S, state: S) => void;
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
    private previousState?: S;

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
            const shouldListen = this.widget.listenWhen && this.previousState
                ? this.widget.listenWhen(this.previousState as S, state)
                : true;

            if (shouldListen) {
                this.widget.listener(context, state);
            }

            this.previousState = state;
        });
        return this.widget.child ?? new EmptyWidget(); // or return some default empty widget
    }
}
