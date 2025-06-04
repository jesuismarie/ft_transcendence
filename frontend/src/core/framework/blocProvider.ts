import { BuildContext } from "./buildContext";
import { BlocBase } from "./blocBase";
import  {type InheritedProvider} from "@/core/framework/inheritedProvider";
import {Widget} from "@/core/framework/base";
import {InheritedProviderElement} from "@/core/framework/ElementWidget";
import {UniqueKey} from "@/core/framework/key";


export interface BlocProviderProps<B extends BlocBase<any>> {
    create?: () => B;
    bloc?: B;
    key?: string;
    child?: Widget; // Optional in constructor, required at usage
    listen?: boolean;
}

export class BlocProvider<B extends BlocBase<any>> extends Widget implements InheritedProvider<B> {
    public readonly create?: () => B;
    public readonly bloc?: B;
    public readonly child?: Widget;
    public readonly listen: boolean;
    public key: string;
    private _value: B | null = null;

    constructor(props: BlocProviderProps<B>) {
        super(new UniqueKey().toString());
        if (!props.create && !props.bloc) {
            throw new Error("BlocProvider requires either a create function or a bloc instance.");
        }
        this.create = props.create;
        this.bloc = props.bloc;
        this.key = props.key ?? new UniqueKey().toString()
        this.child = props.child;
        this.listen = props.listen ?? true;
    }

    get value(): B {
        if (this._value) return this._value;
        if (this.bloc) return this.bloc;
        if (this.create) {
            this._value = this.create();
            return this._value;
        }
        throw new Error("BlocProvider has no bloc or create function.");
    }

    getChild(): Widget {
        if (!this.child) {
            throw new Error("BlocProvider used outside MultiBlocProvider must specify a child.");
        }
        return this.child;
    }

    createElement(): BlocProviderElement<B> {
        return new BlocProviderElement<B>(this);
    }

    static of<B extends BlocBase<any>>(context: BuildContext, blocType: new (...args: any[]) => B, listen = true): B {
        const provider = context.element.findInheritedProvider<B>(blocType);

        if (!provider) {
            throw new Error(
                `BlocProvider.of() called with a context that does not contain a Bloc of type ${blocType.name}.`
            );
        }

        return listen ? context.watch<B>(blocType) : context.read<B>(blocType);
    }

    copyWithChild(child: Widget): BlocProvider<B> {
        return new BlocProvider<B>({
            create: this.create,
            bloc: this.bloc,
            listen: this.listen,
            child,
        });
    }

    afterMounted(context: BuildContext): void {}
}


export class BlocProviderElement<B extends BlocBase<any>> extends InheritedProviderElement<B> {
    private readonly _bloc: B;
    private readonly _ownsBloc: boolean;

    constructor(widget: BlocProvider<B>) {
        super(widget);

        if (widget.bloc) {
            this._bloc = widget.bloc;
            this._ownsBloc = false;
        } else if (widget.create) {
            this._bloc = widget.create();
            this._ownsBloc = true;
        } else {
            throw new Error("BlocProviderElement could not create or find a bloc instance.");
        }
    }

    get bloc(): B {
        return this._bloc;
    }

    getValue(): B {
        return this.bloc;
    }

    unmount() {
        super.unmount();
        if (this._ownsBloc && this._bloc) {
            this._bloc.close().then(r => r);
        }
    }
}
