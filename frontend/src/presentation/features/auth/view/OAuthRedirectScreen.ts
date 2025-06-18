import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {Navigator} from "@/core/framework/widgets/navigator";
import {showFlushBar} from "@/presentation/common/widget/flushBar";

export class OAuthRedirectScreen extends StatelessWidget {
    constructor(public ticketId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const authBloc = context.read(AuthBloc);
        authBloc.claimTicket(this.ticketId ?? undefined).then(() => {
        });
        authBloc.stream.subscribe((state) => {
            if (state.status == AuthStatus.Success) {
                Navigator.of(context).pushNamed('/');
                window.location.reload();
            }
            if(state.status == AuthStatus.Error) {
                Navigator.of(context).pushNamed('/');
                window.location.reload();
                showFlushBar({message: "OAuth failed"});
            }
        })
    }

    build(context: BuildContext): Widget {
        return new EmptyWidget(`<p>Loading</p>`)
    }
}