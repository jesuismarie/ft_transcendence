import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";
import {UniqueKey} from "@/core/framework/core/key";

export class EmptyWidget extends StatelessWidget {
    constructor(public key: string = new UniqueKey().toString()) {
        super(key);
    }
    build(context: BuildContext): Widget {
        return new HtmlWidget(``);
    }

}