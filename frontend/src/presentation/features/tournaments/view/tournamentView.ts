import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {TournamentList} from "@/presentation/features/tournaments/view/tournamentList";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {type TournamentState, TournamentStatus} from "@/presentation/features/tournaments/logic/tournamentState";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";

export class TournamentView extends StatelessWidget {
    constructor(private parentId?: string, private userId?: number) {
        super();
    }
    didMounted(context: BuildContext) {
        super.didMounted(context);
        const authBloc = context.read(AuthBloc);
        const currentUserId = authBloc.state.user?.userId;
        if (this.userId && currentUserId && this.userId == currentUserId) {
            context.read(TournamentBloc).getAllTournaments(0, this.userId).then(r => r)
        }
    }

    build(context: BuildContext): Widget {
        return new BlocBuilder<TournamentBloc, TournamentState>({
            builder: (context, state) => state.status == TournamentStatus.Loading ? new HtmlWidget(`<p>Loading</p>`, this.parentId) : new TournamentList(state.results, this.parentId)
        })
    }

}