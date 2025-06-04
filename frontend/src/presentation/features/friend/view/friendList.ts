import {StatelessWidget} from "@/core/framework/statelessWidget";
import {type BuildContext} from "@/core/framework/buildContext";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {type Widget} from "@/core/framework/base";
import {hideModal, showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {BlocProvider} from "@/core/framework/blocProvider";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {Resolver} from "@/di/resolver";

export class FriendList extends StatelessWidget {
    build(context: BuildContext): Widget {
        return new BlocProvider(
            {
                create: () => new FriendBloc(
                    Resolver.friendRepository()
                ),
                child: new FriendListContent()
            }
        )
    }

}

export class FriendListContent extends StatelessWidget {

    constructor(public parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const previewContainer = document.getElementById("friends-preview") as HTMLElement;
        const listContainer = document.getElementById("friend-modal-list") as HTMLElement;

        const prevPageBtn = document.getElementById("prev-friends-page") as HTMLButtonElement;
        const nextPageBtn = document.getElementById("next-friends-page") as HTMLButtonElement;
        const pageInfo = document.getElementById("friend-page-info") as HTMLElement;
        const paginatioBtns = document.getElementById("friend-pagination") as HTMLElement;

        const closeModalBtn = document.getElementById("close-friends-modal") as HTMLButtonElement;

        closeModalBtn?.addEventListener("click", () => {
            hideModal(ModalConstants.friendsModalName)
        })
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
        <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg border-b border-hover pb-2">
						All Friends
					</h3>
					<div id="friend-modal-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
					</div>
				</div>
				<div id="friend-pagination" class="hidden flex justify-between items-center p-4 border-t border-gray-200">
					<button id="prev-friends-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
					<span id="friend-page-info" class="text-sm"></span>
					<button id="next-friends-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
					<button id="close-friends-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
        `, this.parentId);
    }

}