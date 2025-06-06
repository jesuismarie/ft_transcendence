import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";

export class UpcomingTournamentsModal extends  StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }
    build(context: BuildContext): Widget {
        return new HtmlWidget(`
        <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">-->
            <div class="px-4 pt-5 pb-4 sm:p-6">
                <h3 class="text-lg border-b border-hover pb-2">
                    All Tournaments
                </h3>
                <p class="error-msg text-red-500 text-sm" data-error-for="tournament1"></p>
                <div id="tournament-modal-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200"></div>
            </div>
            <div id="tournament-pagination" class="hidden flex justify-between items-center p-4 border-t border-gray-200">
                <button id="prev-tournament-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
                <span id="tournament-page-info" class="text-sm"></span>
                <button id="next-tournament-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
                <button id="close-tournament-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
            </div>
        </div>`, this.parentId);
    }

}