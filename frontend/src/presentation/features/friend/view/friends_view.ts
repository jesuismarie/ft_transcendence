import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {type Widget} from "@/core/framework/core/base";
import {hideModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {Constants} from "@/core/constants/constants";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import type {FriendState} from "@/presentation/features/friend/logic/friendState";
import {FriendList} from "@/presentation/features/friend/view/friendList";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {SubmitButton} from "@/presentation/common/widget/submitButton";


export class FriendsView extends StatelessWidget {

    constructor(public parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const friendBloc = context.read(FriendBloc);
        const authBloc = context.read(AuthBloc);

        const prevPageBtn = document.getElementById("prev-friends-page") as HTMLButtonElement;
        const nextPageBtn = document.getElementById("next-friends-page") as HTMLButtonElement;


        prevPageBtn?.addEventListener("click", (e) => {
            const offset = friendBloc.state.offset;
            const userId = authBloc.state.user?.userId
            if (!friendBloc.isClosed && userId && offset >= Constants.friends_limit) {
                friendBloc.onSearch(userId, Constants.friends_limit - offset, Constants.friends_limit).then(r => r);
            }
        })
        nextPageBtn?.addEventListener("click", (e) => {
            const offset = friendBloc.state.offset;
            const userId = authBloc.state.user?.userId
            const totalCount = friendBloc.state.results?.totalCount ?? 0;
            if (!friendBloc.isClosed && userId && offset + Constants.friends_limit < totalCount) {
                friendBloc.onSearch(userId, Constants.friends_limit + offset, Constants.friends_limit).then(r => r);
            }
        })

    }

    build(context: BuildContext): Widget {
        return new BlocBuilder<FriendBloc, FriendState>({
            blocType: FriendBloc,
            buildWhen: (oldState, newState) => !oldState.equals(newState),
            builder: (context, state) =>
                new DependComposite({
                    dependWidgets: [new HtmlWidget(`
        <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg border-b border-hover pb-2">
						All Friends
					</h3>
					<div id="friend-modal-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
					</div>
				</div>
				<div id="friend-pagination" class="${(state.results?.totalCount ?? 0) > Constants.friends_limit ? "" : "hidden"} flex justify-between items-center p-4 border-t border-gray-200">
					<button id="prev-friends-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
					<span id="friend-page-info" class="text-sm"></span>
					<button id="next-friends-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
				    <div id="close-friend-dialog"></div>
					<button id="close-friends-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
        `, this.parentId)],
                    children: [
                        new FriendList('friend-modal-list'),
                        new SubmitButton({
                            className: "px-4 py-2 text-sm rounded-md border border-hover hover:text-hover",
                            id: "close-friends-modal",
                            label: "Close",
                            parentId: "close-friend-dialog",
                            isHidden: false,
                            onClick: () => {
                                hideModal(ModalConstants.friendsModalName)
                            }
                        })
                    ]
                })
        });
    }

}