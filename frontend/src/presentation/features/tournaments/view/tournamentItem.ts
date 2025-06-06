import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {Composite} from "@/core/framework/widgets/composite";
import {MountAwareComposite} from "@/core/framework/widgets/mountAwareComposite";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import type {TournamentInfoDetailsEntity} from "@/domain/entity/tournamentInfoDetailsEntity";
import type {FriendUser} from "@/domain/entity/friendUser";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";

export class TournamentItem extends StatelessWidget {
    constructor(private tournamentItem: TournamentInfoDetailsEntity) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const tournamentBloc = context.read(TournamentBloc);
        const startBtn = document.getElementById('start-tournament-btn');
        const deleteBtn = document.getElementById('delete-tournament-btn');
        startBtn?.addEventListener('click', () => {
            tournamentBloc.startTournament(this.tournamentItem.id).then(r => r);
        })
        const currentUser = context.read(ProfileBloc).state.profile;
        deleteBtn?.addEventListener('click', () => {
            if (currentUser) {
                tournamentBloc.deleteTournament(this.tournamentItem.id, currentUser.username).then(r => r);
            }
        })
    }

    build(context: BuildContext): Widget {
        const currentUser = context.read(ProfileBloc).state.profile
        return new Composite([new HtmlWidget(`
        <div class="px-4 py-5 sm:px-6 hover:bg-gray-50">
			<div class="flex flex-col sm:flex-row sm:justify-between">
				<div align="left">
					<h3 class="text-lg font-medium">${this.tournamentItem.name}</h3>
					<p class="mt-1 text-sm text-gray-500">
						Players: ${this.tournamentItem.current_players_count}/${this.tournamentItem.max_players_count}
					</p>
					<p class="mt-1 text-sm text-gray-500">
						Created by: ${this.tournamentItem.created_by}
					</p>
				</div>
				<div align="right" class="mt-2 sm:mt-0 flex flex-col sm:flex-row gap-2 items-end sm:items-start">
					${currentUser && this.tournamentItem.created_by == currentUser.username ? `
						<button id="start-tournament-btn" class="start-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
							Start
						</button>
						<button id="delete-tournament-btn" class="delete-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
							Delete
						</button>
					` : ''}
					<div id="tournament-btn-content"></div>
				</div>
			</div>
		</div>

        `),
            new MountAwareComposite((context) => new SubmitButton({
                parentId: "tournament-btn-content"
            }))
        ]);
    }

}