import {Widget} from "@/core/framework/base";
import {InheritedProviderElement} from "@/core/framework/ElementWidget";
import {BuildContext} from "@/core/framework/buildContext";
import {UniqueKey} from "@/core/framework/key";

export class InheritedProvider<T> extends Widget {
    constructor(public readonly value: T, public readonly child?: Widget, public key: string = new UniqueKey().toString()) {
        super(key);
    }

    createElement(): InheritedProviderElement<T> {
        return new InheritedProviderElement<T>(this);
    }
    afterMounted(context: BuildContext): void {}
}
