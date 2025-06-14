import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import type {TournamentInfoDetailsEntity} from "@/domain/entity/tournamentInfoDetailsEntity";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {PaginationType, TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {Bindings} from "@/presentation/features/bindings";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {type ProfileState, ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {MatchBloc} from "@/presentation/features/match/bloc/match_bloc";
import {MatchState, MatchStatus} from "@/presentation/features/match/bloc/match_state";
import {TournamentStatus} from "@/presentation/features/tournaments/logic/tournamentState";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {Navigator} from "@/core/framework/widgets/navigator";
import {showFlushBar} from "@/presentation/common/widget/flushBar";
import {Constants} from "@/core/constants/constants";

export class TournamentItem extends StatelessWidget {
    constructor(private tournamentItem: TournamentInfoDetailsEntity, private currentId?: number) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
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
					<div id="start-tournament-btn-content-${this.tournamentItem.id}"></div>
					<div id="delete-tournament-btn-content-${this.tournamentItem.id}"></div>
					<div id="register-tournament-btn-content-${this.tournamentItem.id}"></div>
					<div id="unregister-tournament-btn-content-${this.tournamentItem.id}"></div>
					<div id="join-tournament-btn-content-${this.tournamentItem.id}"></div>
				</div>
			</div>
		</div>

        `)],
            children: [
                new BlocListener<MatchBloc, MatchState>({
                    blocType: MatchBloc,
                    listener: (context, state) => {
                        if (state.status == MatchStatus.Created) {
                            // Navigator.of(context).pushNamed('/game')
                        }
                        if (state.status === MatchStatus.Error) {
                            showFlushBar({message: state.errorMessage ?? "UNKNOWN ERROR"});
                            // showError("tournament1", state.errorMessage ?? "UNKNOWN ERROR")
                            // context.read(MatchBloc).resetStatus()
                        }
                    },
                    child: new BlocBuilder<ProfileBloc, ProfileState>({
                        blocType: ProfileBloc,
                        buildWhen: (oldState, newState) => !oldState.equals(newState),
                        builder: (context, state) => new SubmitButton({
                            className: 'start-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
                            id: 'start-tournament-btn',
                            label: 'Start',
                            onClick: state.status == ProfileStatus.Loading
                            || context.read(TournamentBloc).state.status == TournamentStatus.Loading
                            || context.read(MatchBloc).state.status == MatchStatus.Loading ? () => {}
                                : () => {
                                console.log("UUUUUUUUUUUUUUUUUUUUUUU")
                                if (!Bindings.isTournamentItemBounded) {
                                    context.read(TournamentBloc).getRelevantParticipants(this.tournamentItem.id).then(r => {
                                    });
                                    context.read(TournamentBloc).getOnlineState(this.tournamentItem.id).then(() => {
                                    });

                                    const unsubscribe = context.read(TournamentBloc).stream.subscribe((state) => {
                                        console.log(`{{{{{{{{{{{{{::::: ${state.status} ${JSON.stringify(state.online)}`);
                                        if (state.status == TournamentStatus.SuccessOnline) {
                                            context.read(MatchBloc).createMatch(this.tournamentItem.id, this.tournamentItem.created_by, state.online).then(r => r);
                                            context.read(TournamentBloc).getAllTournaments(0, Constants.tournament_limit, PaginationType.none).then(() => {})
                                        }
                                    })
                                    Bindings.isTournamentItemBounded = true;
                                }

                            },
                            isHidden: state.profile && state.profile.id != this.tournamentItem.created_by,
                        }),
                        parentId: `start-tournament-btn-content-${this.tournamentItem.id}`
                    })
                }),
                new BlocBuilder<ProfileBloc, ProfileState>({
                    blocType: ProfileBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => {

                        console.log(`UUUUUUUUUUUUUUU:::::: ${state.profile?.id} ${this.tournamentItem.created_by}`)
                        return new SubmitButton({
                            className: 'delete-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
                            id: 'delete-tournament-btn',
                            label: 'Delete',
                            onClick: () => {
                                if (!Bindings.isTournamentItemBounded) {
                                    if (currentUser) {
                                        context.read(TournamentBloc).deleteTournament(this.tournamentItem.id, currentUser.id).then(r => r);
                                    }
                                    Bindings.isTournamentItemBounded = true;
                                }
                            },
                            disabled: this.tournamentItem.status != "created",
                            isHidden: state.profile && state.profile.id != this.tournamentItem.created_by,
                        })
                    },
                    parentId: `delete-tournament-btn-content-${this.tournamentItem.id}`

                }),
                new BlocBuilder<ProfileBloc, ProfileState>({
                    blocType: ProfileBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => {

                        console.log(`UUUUUUUUUUUUUUU:::::: ${state.profile?.id} ${this.tournamentItem.created_by}`)
                        return new SubmitButton({
                            className: 'px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
                            id: 'join-tournament-btn',
                            label: 'Join',
                            onClick: () => {
                                const matchId = this.tournamentItem.activeMatch?.matchId;
                                console.log(`MATCHHHHHHH ${matchId}`);
                                if (matchId && state.profile && this.tournamentItem.participants.includes(state.profile!.id) && this.tournamentItem.status == 'in_progress') {
                                    Navigator.of(context).pushNamed(`/game/${matchId.toString()}/${state.profile.id.toString()}`);
                                }
                                else if (this.tournamentItem.status != 'in_progress') {
                                    showFlushBar({message: 'Tournament not started yet'});
                                }

                            },
                            isHidden: this.tournamentItem.id != this.currentId || this.tournamentItem.status != 'in_progress',
                        })
                    },
                    parentId: `join-tournament-btn-content-${this.tournamentItem.id}`

                }),
                new BlocBuilder<ProfileBloc, ProfileState>({
                    blocType: ProfileBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => {
                        console.log(`JJJJJJJJJJJJJJJJJ::::: ${state.profile?.id} ${this.tournamentItem.participants} ${this.tournamentItem.participants.includes(state.profile!.id)}`)

                        return new SubmitButton({
                            className: 'px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800',
                            id: 'register-tournament-btn',
                            label: 'Register',
                            onClick: () => {
                                if (!Bindings.isTournamentItemBounded) {
                                    if (state.profile) {
                                        context.read(TournamentBloc).registerToTournament(this.tournamentItem.id, state.profile.id).then(r => r);
                                    }
                                    Bindings.isTournamentItemBounded = true;
                                }
                            },
                            isHidden: state.profile && (state.profile.id == this.tournamentItem.created_by || !!this.currentId || this.currentId == this.tournamentItem.id),
                        })
                    },
                    parentId: `register-tournament-btn-content-${this.tournamentItem.id}`

                }),

                new BlocBuilder<ProfileBloc, ProfileState>({
                    blocType: ProfileBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => {
                        console.log(`JJJJJJJJJJJJJJJJJ::::: ${state.profile?.id} ${this.tournamentItem.participants} ${this.tournamentItem.participants.includes(state.profile!.id)}`)
                        return new SubmitButton({
                            className: 'px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
                            id: 'unregister-tournament-btn',
                            label: 'Unregister',
                            onClick: () => {
                                if (!Bindings.isTournamentItemBounded) {
                                    if (state.profile) {
                                        context.read(TournamentBloc).unregisterToTournament(this.tournamentItem.id, state.profile.id).then(r => r);
                                    }
                                    Bindings.isTournamentItemBounded = true;
                                }
                            },
                            isHidden: state.profile && (state.profile.id == this.tournamentItem.created_by || !this.currentId || (this.tournamentItem.id != this.currentId!)),
                        })
                    },
                    parentId: `unregister-tournament-btn-content-${this.tournamentItem.id}`

                })
            ]
        });
    }

}