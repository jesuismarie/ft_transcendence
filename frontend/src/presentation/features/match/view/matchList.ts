import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
// import type {MatchHistory} from "@/utils/types";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {MatchHistory} from "@/domain/entity/matchHistory";
import {MatchListItem} from "@/presentation/features/match/view/matchListItem";
import {Composite} from "@/core/framework/widgets/composite";

export class MatchList extends StatelessWidget {
    constructor(public matches: MatchHistory, public parentId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        if (this.matches.totalCount === 0 || this.matches.matches.length === 0) {
            return new HtmlWidget(`<p class="text-gray-500 p-4">No matches yet.</p>`);
        }
        return new Composite(this.matches.matches.map((e) => new MatchListItem(e)), this.parentId);
    }
}