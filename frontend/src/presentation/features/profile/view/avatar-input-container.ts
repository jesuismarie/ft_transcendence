import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";

export class AvatarInputContainer extends StatelessWidget {


    build(context: BuildContext): Widget {
        return new HtmlWidget(`<input type="file" id="avatar-input" class="" accept="image/*" />`)
    }
}