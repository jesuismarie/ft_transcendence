import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
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
import {Bindings} from "@/presentation/features/bindings";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import type {ProfileState} from "@/presentation/features/profile/bloc/profileState";

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
            if (!Bindings.isTournamentItemBounded) {
                if (currentUser) {
                    tournamentBloc.deleteTournament(this.tournamentItem.id, currentUser.username).then(r => r);
                }
                Bindings.isTournamentItemBounded = true;
            }
        })
    }

    build(context: BuildContext): Widget {
        const currentUser = context.read(ProfileBloc).state.profile
        return new DependComposite({
            dependWidgets: [new HtmlWidget(`
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
					<div id="start-tournament-btn-content"></div>
					<div id="delete-tournament-btn-content"></div>
					<div id="register-tournament-btn-content"></div>
				</div>
			</div>
		</div>

        `)],
            children: [
                new BlocBuilder<ProfileBloc, ProfileState>({
                    blocType: ProfileBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => new SubmitButton({
                        className: 'start-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
                        id: 'start-tournament-btn',
                        isHidden: state.profile && state.profile.id == this.tournamentItem.created_by,
                        parentId: "start-tournament-btn-content"
    })
                }),
                new BlocBuilder<ProfileBloc, ProfileState>({
                    blocType: ProfileBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => new SubmitButton({
                        className: 'delete-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
                        id: 'delete-tournament-btn',
                        isHidden: state.profile && state.profile.id == this.tournamentItem.created_by,
                        parentId: "delete-tournament-btn-content"
                    })
                }),
                new BlocBuilder<ProfileBloc, ProfileState>({
                    blocType: ProfileBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => new SubmitButton({
                        className: 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
                        id: 'register-tournament-btn',
                        isHidden: state.profile && state.profile.id == this.tournamentItem.created_by,
                        parentId: "register-tournament-btn-content"
                    })
                })
            ]
        });
    }

}