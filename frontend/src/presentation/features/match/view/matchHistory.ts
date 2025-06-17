import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {MatchList} from "@/presentation/features/match/view/matchList";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {MatchBloc} from "@/presentation/features/match/bloc/match_bloc";
import {MatchState} from "@/presentation/features/match/bloc/match_state";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import type {AuthState} from "@/presentation/features/auth/logic/auth_state";
import {Constants} from "@/core/constants/constants";
import {Bindings} from "@/presentation/features/bindings";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";

export class MatchHistory extends StatelessWidget {
    constructor(public userId?: number, public parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);

        const matchBloc = context.read(MatchBloc);
        // if (!Bindings.isMatchRequest) {
            if (this.userId) {
                matchBloc.getMatchHistory(this.userId, 0, Constants.match_limit).then(history => {
                });
            }
            // Bindings.isMatchRequest = true;
        // }

    }

    build(context: BuildContext): Widget {
        return new DependComposite({dependWidgets: [new HtmlWidget(`
        <h3 class="text-lg font-medium border-b border-hover">
			Match History
		</h3>
		<div id="matches-preview" class="divide-y divide-gray-200">
		</div>
		<div id="match-list-btn-container"></div>
        <div id="match-list-btn-container-view"></div>`, this.parentId)],
        children: [
            new BlocBuilder<MatchBloc, MatchState>({
                blocType: MatchBloc,
                buildWhen: (oldState, newState) => !oldState.equals(newState),
                builder: (context, state) => new MatchList(state.results),
                parentId: 'matches-preview'
            }, ),
            new BlocBuilder<MatchBloc, MatchState>({
                blocType: MatchBloc,
                buildWhen: (oldState, newState) => !oldState.equals(newState),
                builder: (context, state) => new SubmitButton({
                    className: 'px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover',
                    id: 'match-list-btn',
                    isHidden: state.results.totalCount <= Constants.match_limit,
                    label: 'View All Matches',
                    onClick: () => {
                        showModal(ModalConstants.matchesModalName)
                    }
                }),
                parentId: 'match-list-btn-container-view'
            })

        ]

    });
    }


}