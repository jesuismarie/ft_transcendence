import {Widget} from "@/core/framework/core/base";
import {BuildContext} from "@/core/framework/core/buildContext";
import {UniqueKey} from "@/core/framework/core/key";
import {InheritedProviderElement} from "@/core/framework/renderer/ElementWidget";

export class InheritedProvider<T> extends Widget {
    constructor(public readonly value: T, public readonly child?: Widget, public key: string = new UniqueKey().toString()) {
        super(key);
    }

    createElement(): InheritedProviderElement<T> {
        return new InheritedProviderElement<T>(this);
    }
    afterMounted(context: BuildContext): void {}
}
