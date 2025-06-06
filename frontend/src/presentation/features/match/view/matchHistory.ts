import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";

export class MatchHistory extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
        <h3 class="text-lg font-medium border-b border-hover">
			Match History
		</h3>
		<div id="matches-preview" class="divide-y divide-gray-200">
		</div>
		<button id="match-list-btn" class="hidden px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">
		    View All Matches
		</button>`, this.parentId);
    }


}