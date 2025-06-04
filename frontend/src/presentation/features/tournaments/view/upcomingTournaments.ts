import {StatelessWidget} from "@/core/framework/statelessWidget";
import type {BuildContext} from "@/core/framework/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import type {Widget} from "@/core/framework/base";

export class UpcomingTournaments extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
        <h3 class="text-lg font-medium border-b border-hover mb-4">
			Upcoming Tournaments
		</h3>
		<p class="error-msg text-red-500 text-sm" data-error-for="tournament2"></p>
		<div id="tournament-preview" class="divide-y divide-gray-200"></div>
		<button id="view-tournament" class="hidden mt-4 px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">
			Browse Tournaments
		</button>
		<button id="add-tournament-preview-btn" class="mt-4 px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">
			Add Tournament / Play with Friend
		</button>
        `, this.parentId);
    }

}