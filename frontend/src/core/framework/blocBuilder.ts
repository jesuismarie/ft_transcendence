import {BuildContext} from "./buildContext";
import {BlocBase} from "./blocBase";

import {BlocProvider} from "@/core/framework/blocProvider";
import {WidgetElement} from "@/core/framework/ElementWidget";
import {Widget} from "@/core/framework/base";
import {WidgetBinding} from "@/core/framework/widgetBinding";
import type {Equatable} from "@/core/framework/equatable";
import {EventBindingManager} from "@/core/framework/listenersRegisty";

export interface BlocBuilderProps<B extends BlocBase<S>, S extends Equatable<S>> {
    bloc?: B;
    blocType?: new (...args: any[]) => B;
    buildWhen?: (previous: S, current: S) => boolean;
    builder: (context: BuildContext, state: S) => Widget;
}

export class BlocBuilder<B extends BlocBase<S>, S extends Equatable<S>> extends Widget {
    readonly bloc?: B;
    readonly blocType?: new (...args: any[]) => B;
    readonly buildWhen?: (previous: S, current: S) => boolean;
    readonly builder: (context: BuildContext, state: S) => Widget;

    private _lastState?: S;

    constructor(props: BlocBuilderProps<B, S>) {
        super();
        this.bloc = props.bloc;
        this.blocType = props.blocType;
        this.buildWhen = props.buildWhen;
        this.builder = props.builder;
    }

    createElement() {
        // Create a BlocBuilderElement to manage subscription & rebuilding
        return new BlocBuilderElement<B, S>(this);
    }

    afterMounted(context: BuildContext): void {
    }
}

class BlocBuilderElement<B extends BlocBase<S>, S extends Equatable<S>> extends WidgetElement {
    widget: BlocBuilder<B, S>;
    private context?: BuildContext;
    private bloc!: B;
    private currentState!: S;
    private unsubscribe?: () => void;
    private rebuildScheduled = false;

    constructor(widget: BlocBuilder<B, S>) {
        super(widget);
        this.widget = widget;
    }

    mount(parentDom: HTMLElement, context: BuildContext): void {
        this.context = context;

        if (this.widget.bloc) {
            this.bloc = this.widget.bloc;
        } else if (this.widget.blocType) {
            this.bloc = BlocProvider.of<B>(context, this.widget.blocType);
        } else {
            throw new Error(
                "BlocBuilder requires either bloc or blocType prop to find the bloc."
            );
        }

        this.currentState = this.bloc.state;

        const subscription = this.bloc.stream.subscribe((newState: S) => {
            if (
                !this.widget.buildWhen ||
                this.widget.buildWhen(this.currentState, newState)
            ) {
                this.currentState = newState;
                this.rebuild();
            } else {
                this.currentState = newState;
            }
        });


        super.mount(parentDom, context);
    }

    rebuild() {
        if (!this.rebuildScheduled) {
            this.rebuildScheduled = true;
            requestAnimationFrame(() => {
                this.rebuildScheduled = false;
                this.performRebuild();

            });
        }

    }

    private performRebuild() {
        this.unmount();
        this.mount(this.dom!, new BuildContext(this));
    }

    unmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const template = document.createElement("my-widget");
        const builtWidget = this.widget.builder(this.currentContext, this.currentState);
        const element = builtWidget.createElement() as WidgetElement;
        element.parent = this;
        element.mount(template, this.currentContext);
        parentDom.appendChild(template);
        // template.addEventListener('mounted')
        WidgetBinding.getInstance().postFrameCallback(() => {
            this.widget.afterMounted(this.currentContext);
        })
        return parentDom;
    }
}
