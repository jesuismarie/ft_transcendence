import {BuildContext} from "../core/buildContext";
import {BlocBase} from "./blocBase";

import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {Widget} from "@/core/framework/core/base";
import {WidgetBinding} from "@/core/framework/core/widgetBinding";
import type {Equatable} from "@/core/framework/core/equatable";
import {EventBindingManager} from "@/core/framework/core/listenersRegisty";
import {WidgetElement} from "@/core/framework/renderer/ElementWidget";

export interface BlocBuilderProps<B extends BlocBase<S>, S extends Equatable<S>> {
    bloc?: B;
    blocType?: new (...args: any[]) => B;
    parentId?: string;
    buildWhen?: (previous: S, current: S) => boolean;
    builder: (context: BuildContext, state: S) => Widget;
}

export class BlocBuilder<B extends BlocBase<S>, S extends Equatable<S>> extends Widget {
    readonly bloc?: B;
    readonly parentId?: string;
    readonly blocType?: new (...args: any[]) => B;
    readonly buildWhen?: (previous: S, current: S) => boolean;
    readonly builder: (context: BuildContext, state: S) => Widget;

    private _lastState?: S;

    constructor(props: BlocBuilderProps<B, S>) {
        super();
        this.bloc = props.bloc;
        this.parentId = props.parentId
        this.blocType = props.blocType;
        this.buildWhen = props.buildWhen;
        this.builder = props.builder;
    }

    createElement() {
        // Create a BlocBuilderElement to manage subscription & rebuilding
        return new BlocBuilderElement<B, S>(this, this.parentId);
    }

    onMount(value: boolean) {}

    afterMounted(context: BuildContext): void {
    }

    didMounted(context: BuildContext): void {}
}

class BlocBuilderElement<B extends BlocBase<S>, S extends Equatable<S>> extends WidgetElement {
    widget: BlocBuilder<B, S>;
    private context?: BuildContext;
    private bloc!: B;
    private currentState!: S;
    private unsubscribe?: () => void;
    private rebuildScheduled = false;
    private didMount: boolean = false;

    constructor(widget: BlocBuilder<B, S>, private parentId?: string) {
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
            } else if (!this.currentState.equals(newState)) {
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
        this.didMount = false
    }

    render(parentDom: HTMLElement, context: BuildContext): HTMLElement {
        const template = document.createElement("my-widget");
        const builtWidget = this.widget.builder(this.currentContext, this.currentState);
        this.child= builtWidget.createElement() as WidgetElement;
        this.child.parent = this;
        const mountPoint = this.parentId ? document.getElementById(this.parentId) : template;

        if (!mountPoint) {
            throw new Error(`Mount point with id "${this.parentId}" not found.`);
        }
        this.child.mount(template, this.currentContext);

        const parent = this.parentId ? mountPoint : parentDom;
        this.child.mount(template, new BuildContext(this.child));
        const comp = parent?.querySelectorAll('my-widget');
        if (comp && comp.length > 0) {
            comp.forEach((e) => e.remove())
        }
        parent.appendChild(template);
        WidgetBinding.getInstance().postFrameCallback(() => {
            this.widget.onMount(true);
            this.widget.afterMounted(this.currentContext);
            if (!this.didMount) {
                this.didMount = true;
                this.widget.didMounted(context);
            }
        })

        return template;
    }
}
