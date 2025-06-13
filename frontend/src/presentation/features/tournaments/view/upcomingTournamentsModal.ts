import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {Pagination} from "@/presentation/common/widget/pagination";
import {Constants} from "@/core/constants/constants";
import {SearchBloc} from "@/presentation/features/search/logic/searchBloc";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import  {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import  {TournamentState} from "@/presentation/features/tournaments/logic/tournamentState";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {hideModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";

export class UpcomingTournamentsModal extends  StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }
    build(context: BuildContext): Widget {
        return new DependComposite({dependWidgets: [new HtmlWidget(`
        <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">-->
            <div class="px-4 pt-5 pb-4 sm:p-6">
                <h3 class="text-lg border-b border-hover pb-2">
                    All Tournaments
                </h3>
                <p class="error-msg text-red-500 text-sm" data-error-for="tournament1"></p>
                <div id="tournament-modal-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200"></div>
            </div>
            <div id="tournament-pagination-container"></div>
            <div id="close-tournament-content" class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
<!--                <button id="close-tournament-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>-->
            </div>
        </div>`, this.parentId)], children: [
                new SubmitButton({
                    className: "px-4 py-2 text-sm rounded-md border border-hover hover:text-hover",
                    onClick: () => {
                        // hideModal(ModalConstants.tou)
                    },
                    isHidden: false,
                    disabled: false,
                    id: "close-tournament-modal",
                    label: "Close",
                }, 'close-tournament-content'),
            new BlocBuilder<TournamentBloc, TournamentState>({
                buildWhen: (oldState, newState) => !oldState.equals(newState),
                blocType: TournamentBloc,
                builder: (context, state) => new Pagination({
                    id: "tournament-pagination",
                    offset: state.offset,
                    totalCount: state.results.totalCount ?? 0,
                    limit: Constants.search_limit,
                    onNextPage: async () => {
                        const tournamentBloc = context.read(TournamentBloc)
                        // const query = searchBloc.state.query.trim();
                        if (tournamentBloc.state.offset + Constants.search_limit < (tournamentBloc.state.results?.totalCount ?? 0)) {
                            await tournamentBloc.getAllTournaments(tournamentBloc.state.offset + Constants.search_limit, Constants.tournament_limit);
                        }
                    },
                    onPreviousPage: async () => {
                        const tournamentBloc = context.read(TournamentBloc)
                        if (tournamentBloc.state.offset >= Constants.tournament_limit) {
                            await tournamentBloc.getAllTournaments(tournamentBloc.state.offset - Constants.search_limit, Constants.tournament_limit);
                        }
                    },
                    isHidden: state.results?.totalCount > Constants.search_limit,
                    nextId: 'next-tournament-page',
                    previousId: 'prev-tournament-page'
                }, 'tournament-pagination-container')
            })

            ]});
    }

}