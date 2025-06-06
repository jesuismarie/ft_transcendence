import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";
import {showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";

export class UpcomingTournaments extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const openModalBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;
        openModalBtn?.addEventListener("click", () => {
            showModal(ModalConstants.addTournamentModalName)
        });
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