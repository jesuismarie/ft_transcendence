import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {MatchHistoryItem} from "@/domain/entity/matchHistoryItem";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {AuthState} from "@/presentation/features/auth/logic/auth_state";

export class MatchListItem extends  StatelessWidget {

    constructor(public match: MatchHistoryItem, public parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);

    }


    build(context: BuildContext): Widget {
        return new BlocBuilder<AuthBloc, AuthState>({
            blocType: AuthBloc,
            buildWhen: (oldState, newState) => !oldState.equals(newState),
            builder: (context, state) => new HtmlWidget(`<div class="px-4 py-3 shadow-sm hover:bg-gray-50 transition duration-300">
			<div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
				<div class="text-lg font-semibold text-gray-800 flex items-center flex-wrap gap-2 sm:gap-4">
					<span>${state.user?.userId}</span>
					<span class="font-normal">vs</span>
					<span>${this.match.opponent}</span>
					<span class="ml-auto px-3 py-1 text-xs font-semibold rounded-full
						${this.match.is_won ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} shadow-sm">
						${this.match.is_won ? "Win" : "Lose"}
					</span>
				</div>
				<div class="mt-2 sm:mt-0 text-sm text-gray-500 text-right">
					<div class="font-semibold text-lg text-gray-700">${this.match.score.user} - ${this.match.score.opponent}</div>
					<div>${this.match.date}</div>
				</div>
			</div>
		</div>`, this.parentId)
        });
    }
}