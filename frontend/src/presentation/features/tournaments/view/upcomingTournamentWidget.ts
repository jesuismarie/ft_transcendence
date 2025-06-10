import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {UpcomingTournaments} from "@/presentation/features/tournaments/view/upcomingTournaments";

export class UpcomingTournamentWidget extends StatelessWidget {
    constructor(public isHidden: boolean, public parentId?: string) {
        super();
    }
    build(context: BuildContext): Widget {
        return this.isHidden ? new DependComposite({
            dependWidgets: [new HtmlWidget(`<div id="upcoming-tournaments" class="rounded-md px-5 py-4 border border-hover">
						</div>`, this.parentId)],
            children: [
                new UpcomingTournaments('upcoming-tournaments')
            ]}) : new EmptyWidget()
    }
}