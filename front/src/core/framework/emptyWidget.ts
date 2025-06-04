import {StatelessWidget} from "@/core/framework/statelessWidget";
import type {BuildContext} from "@/core/framework/buildContext";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import type {Widget} from "@/core/framework/base";
import {UniqueKey} from "@/core/framework/key";

export class EmptyWidget extends StatelessWidget {
    constructor(public key: string = new UniqueKey().toString()) {
        super(key);
    }
    build(context: BuildContext): Widget {
        return new HtmlWidget(``);
    }

}