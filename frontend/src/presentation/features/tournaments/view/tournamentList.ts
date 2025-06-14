import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {type Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";
import {TournamentItem} from "@/presentation/features/tournaments/view/tournamentItem";
import {Composite} from "@/core/framework/widgets/composite";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";

export class TournamentList extends StatelessWidget {
    constructor(private tournaments: TournamentInfoEntity, public parentId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        if (this.tournaments.totalCount == 0 || !this.tournaments.tournaments || this.tournaments.tournaments.length == 0) {
            return new HtmlWidget(`<p class="text-gray-500 p-4">No tournaments available.</p>`)
        }
        const currentTournamentID = this.tournaments.tournaments.find((e) => {
            const currentId = context.read(ProfileBloc).state.profile?.id;
            if (!currentId) return undefined;
            return e.participants.includes(currentId) ? e : undefined
        })

        console.log(`KKKKK::::: ${currentTournamentID?.id}`)
        return new Composite(this.tournaments.tournaments.map((e, index) => new TournamentItem(e, currentTournamentID?.id)))
    }

}