import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {type Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {Resolver} from "@/di/resolver";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";
import {TournamentItem} from "@/presentation/features/tournaments/view/tournamentItem";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {Composite} from "@/core/framework/widgets/composite";

export class TournamentList extends StatelessWidget {
    constructor(private tournaments: TournamentInfoEntity, public parentId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        console.log(`TournamentList BUILTTTTTT ${JSON.stringify(this.tournaments)}`)
        if (this.tournaments.totalCount == 0 || !this.tournaments.tournaments || this.tournaments.tournaments.length == 0) {
            return new HtmlWidget(`<p class="text-gray-500 p-4">No tournaments available.</p>`)
        }
        console.log("HERRRRRRRRRRRRRRRRRRRRRR");
        return new Composite([...this.tournaments.tournaments.map((e, index) => new TournamentItem(e))])
    }

}