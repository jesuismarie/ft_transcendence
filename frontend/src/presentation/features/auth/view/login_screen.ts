import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {LoginWidget} from "@/presentation/features/auth/view/loginWidget";

export class LoginScreen extends StatelessWidget {

    build(context: BuildContext): Widget {
        return new LoginWidget();
    }
}