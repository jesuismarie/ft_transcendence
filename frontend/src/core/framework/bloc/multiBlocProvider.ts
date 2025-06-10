import {Widget} from "@/core/framework/core/base";
import {UniqueKey} from "@/core/framework/core/key";
import type {WidgetElement} from "@/core/framework/renderer/ElementWidget";

interface MultiBlocProviderProps {
    providers: Widget[]; // list of BlocProvider<B>
    child: Widget;
    key?: string;
}

export class MultiBlocProvider extends Widget {
    readonly providers: Widget[];
    readonly child: Widget;
    readonly key: string;

    constructor(props: MultiBlocProviderProps) {
        super();
        this.providers = props.providers;
        this.child = props.child;
        this.key = props.key ?? new UniqueKey().toString();
    }

    createElement(): WidgetElement {
        // Wrap child with all providers in reverse order
        let wrapped = this.child;
        for (let i = this.providers.length - 1; i >= 0; i--) {
            const provider = this.providers[i];
            // Replace the child of the provider with the current wrapped tree
            if ("child" in provider) {
                (provider as any).child = wrapped;
                wrapped = provider;
            } else {
                throw new Error("Each provider must be a BlocProvider with a child.");
            }
        }
        return wrapped.createElement() as WidgetElement;
    }
}
