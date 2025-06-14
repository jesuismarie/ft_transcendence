import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";
import {showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {TournamentList} from "@/presentation/features/tournaments/view/tournamentList";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {PaginationType, TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {TournamentState, TournamentStatus} from "@/presentation/features/tournaments/logic/tournamentState";
import {Constants} from "@/core/constants/constants";
import {Bindings} from "@/presentation/features/bindings";
import {SubmitButton} from "@/presentation/common/widget/submitButton";

export class UpcomingTournaments extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const openModalBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;
        if (!Bindings.isTournamentBounded) {

            const tournamentBloc = context.read(TournamentBloc);
            tournamentBloc.getAllTournaments(0, Constants.tournament_limit, PaginationType.none).then(() => {
            })
            Bindings.isTournamentBounded = true;
        }

        openModalBtn?.addEventListener("click", () => {
            showModal(ModalConstants.addTournamentModalName)
        });
    }

    build(context: BuildContext): Widget {
        return new DependComposite({
            dependWidgets: [new HtmlWidget(`
        <h3 class="text-lg font-medium border-b border-hover mb-4">
			Upcoming Tournaments
		</h3>
		<p class="error-msg text-red-500 text-sm" data-error-for="tournament2"></p>
		<div id="tournament-preview" class="divide-y divide-gray-200"></div>
		<div id="view-tournament-list-container"></div>
		<button id="add-tournament-preview-btn" class="mt-4 px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">
			Add Tournament / Play with Friend
		</button>
        `, this.parentId)], children: [
                new BlocBuilder<TournamentBloc, TournamentState>({
                        blocType: TournamentBloc,
                        buildWhen: (oldState, newState) => !oldState.equals(newState),
                        builder: (context, state) => {
                            if (state.status == TournamentStatus.Loading) {
                                return new HtmlWidget(`<p>Loading</p>`)
                            }
                            return new TournamentList(state.results ?? {totalCount: 0, tournament: []})
                        },

                        parentId: 'tournament-preview'
                    },
                ),
                new BlocBuilder<TournamentBloc, TournamentState>({
                    blocType: TournamentBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => new SubmitButton({
                        className: 'mt-4 px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover',
                        id: 'view-tournament',
                        onClick: () => {
                          showModal(ModalConstants.tournamentModalName)
                        },
                        isHidden: state.results.totalCount <= Constants.tournament_limit,
                        label: 'Browse Tournaments'
                    }),
                    parentId: 'view-tournament-list-container'
                })
            ]
        });
    }

}