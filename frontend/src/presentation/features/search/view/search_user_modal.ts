import {StatelessWidget} from "@/core/framework/statelessWidget";
import {type BuildContext} from "@/core/framework/buildContext";
// import {type Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {Composite} from "@/core/framework/composite";
import {SearchResults} from "@/presentation/features/search/view/searchResults";
import {Resolver} from "@/di/resolver";
import {SEARCH_LIMIT} from "@/profile/search";
import {Builder} from "@/core/framework/builder";
import {hideModal, showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {BlocProvider} from "@/core/framework/blocProvider";
import {SearchBloc} from "@/presentation/features/search/logic/searchBloc";
import {type SearchState, SearchStatus} from "@/presentation/features/search/logic/searchState";
import {BlocBuilder} from "@/core/framework/blocBuilder";
import {type Widget} from "@/core/framework/base";
import {State, StatefulWidget} from "@/core/framework/statefulWidget";
import {isEqual} from "lodash";
import {WidgetBinding} from "@/core/framework/widgetBinding";
import {TextInputWidget} from "@/presentation/common/widget/textInputWidget";
import {BlocListener} from "@/core/framework/blocListener";

export class SearchUserModal extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        return new BlocProvider(
            {
                create: () => new SearchBloc(Resolver.userRepository()),
                child: new SearchUserModalContent(this.parentId)
            }
        );
    }

}


export class SearchUserModalContent extends StatefulWidget {
    constructor(public parentId?: string) {
        super();
    }

    createState(): State<SearchUserModalContent> {
        return new SearchUserModalContentState();
    }

}


export class SearchUserModalContentState extends State<SearchUserModalContent> {

    // searchListeners: any;


    // addSearchModalListeners(context: any, searchBloc: SearchBloc) {
    //     const searchBtn = document.getElementById('search-users-btn') as HTMLButtonElement;
    //     const searchInput = document.getElementById('search-people') as HTMLInputElement;
    //     const nextBtn = document.getElementById('next-search-page') as HTMLButtonElement;
    //     const prevBtn = document.getElementById('prev-search-page') as HTMLButtonElement;
    //     const closeBtn = document.getElementById("close-search-modal") as HTMLElement;
    //
    //     const handleClose = () => hideModal(ModalConstants.searchModalName);
    //     const handleNext = async () => {
    //         const query = searchInput.value.trim();
    //         if (query && searchBloc.state.offset + SEARCH_LIMIT < (searchBloc.state.results?.totalCount ?? 0)) {
    //             await searchBloc.searchUser(query, searchBloc.state.offset + SEARCH_LIMIT);
    //             this.updateValues(context);
    //         }
    //     };
    //     const handlePrev = async () => {
    //         const query = searchInput.value.trim();
    //         if (query && searchBloc.state.offset >= SEARCH_LIMIT) {
    //             await searchBloc.searchUser(query, searchBloc.state.offset - SEARCH_LIMIT);
    //             this.updateValues(context);
    //         }
    //     };
    //     const handleInputChange = async (e: Event) => {
    //         e.preventDefault();
    //         const query = searchInput?.value.trim() ?? '';
    //         if (query.length > 0) {
    //             await searchBloc.searchUser(query, searchBloc.state.offset);
    //             this.updateValues(context);
    //         }
    //     };
    //     const handleSearchClick = () => {
    //         console.log("SEEEE");
    //     };
    //
    //     // Add listeners
    //     closeBtn?.addEventListener('click', handleClose);
    //     nextBtn?.addEventListener('click', handleNext);
    //     prevBtn?.addEventListener('click', handlePrev);
    //     searchInput?.addEventListener('input', handleInputChange)
    //     // searchInput?.addEventListener('change', handleInputChange);
    //     searchBtn?.addEventListener('click', handleSearchClick);
    //
    //     // Store listeners if needed for removal later
    //     this.searchListeners = {
    //         closeBtn, nextBtn, prevBtn, searchInput, searchBtn,
    //         handleClose, handleNext, handlePrev, handleInputChange, handleSearchClick
    //     };
    // }
    //
    // removeSearchModalListeners() {
    //     const { closeBtn, nextBtn, prevBtn, searchInput, searchBtn,
    //         handleClose, handleNext, handlePrev, handleInputChange, handleSearchClick } = this.searchListeners ?? {};
    //
    //     closeBtn?.removeEventListener('click', handleClose);
    //     nextBtn?.removeEventListener('click', handleNext);
    //     prevBtn?.removeEventListener('click', handlePrev);
    //     searchInput?.removeEventListener('change', handleInputChange);
    //     searchBtn?.removeEventListener('click', handleSearchClick);
    //
    //     this.searchListeners = null;
    // }


    updateValues(context: BuildContext): void {
        const searchBloc = context.read(SearchBloc);
        WidgetBinding.getInstance().postFrameCallback(() => {
            const searchPagBtn = document.getElementById('search-pagination');
            if (searchBloc.state.status == SearchStatus.Success) {
                searchBloc.onOffsetChanged(searchBloc.state.results?.totalCount ?? 0);
            }
            if ((searchBloc.state.results?.totalCount ?? 0) > SEARCH_LIMIT)
                searchPagBtn?.classList.remove("hidden");
            else
                searchPagBtn?.classList.add("hidden");
        })

    }

    afterMounted(context: BuildContext) {
        super.afterMounted(context);

    }

    didUpdateWidget(oldWidget: Widget, context: BuildContext) {
        super.didUpdateWidget(oldWidget, context);
        console.log("CHANNNNGEEDDD")
    }

    initState(context: BuildContext) {
        super.initState(context);
        const searchBloc = context.read(SearchBloc);

        WidgetBinding.getInstance().postFrameCallback(() => {
            const searchBtn = document.getElementById('search-users-btn') as HTMLButtonElement;
            const searchInput = document.getElementById('search-people') as HTMLInputElement;
            const nextBtn = document.getElementById('next-search-page') as HTMLButtonElement;
            const prevBtn = document.getElementById('prev-search-page') as HTMLButtonElement;
            const closeBtn = document.getElementById("close-search-modal") as HTMLElement;


            closeBtn?.addEventListener('click', () => {
                hideModal(ModalConstants.searchModalName)
            })
            nextBtn?.addEventListener('click', async () => {
                const query = searchBloc.state.query.trim();
                if (query && searchBloc.state.offset + SEARCH_LIMIT < (searchBloc.state.results?.totalCount ?? 0)) {
                    await searchBloc.searchUser(query, searchBloc.state.offset + SEARCH_LIMIT);
                    this.updateValues(context)
                }
            })
            prevBtn?.addEventListener('click', async () => {
                const query = searchBloc.state.query.trim();
                if (query && searchBloc.state.offset >= SEARCH_LIMIT) {
                    await searchBloc.searchUser(query, searchBloc.state.offset - SEARCH_LIMIT);
                    this.updateValues(context)
                }
            })

            document.addEventListener('click', (e) => {
                if (e.target instanceof HTMLElement && e.target.matches('#my-button')) {
                    const target = e.target as HTMLInputElement;
                    const query = target.value.trim();
                    searchBloc.onQueryChanged(query);
                }
            })
            searchBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                const query = searchBloc.state.query.trim();
                if (query) {
                    searchBloc.searchUser(query, 0);
                }
            })
        })
    }

    build(context: BuildContext): Widget {
        const searchBloc = context.read(SearchBloc);
        return new BlocListener<SearchBloc, SearchState>({
            listener: (context, state) => {
                if (state.oldQuery != state.query) {
                    context.read(SearchBloc).searchUser(state.query, searchBloc.state.offset);
                }
            },
            blocType: SearchBloc,
            child: new BlocBuilder<SearchBloc, SearchState>(
                {
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    blocType: SearchBloc,
                    builder: (context, state) => {
                        const totalPages = state.results ? Math.ceil(state.results.totalCount / SEARCH_LIMIT) : 0;
                        const currentPage = Math.floor(state.offset / SEARCH_LIMIT) + 1;
                        return new Composite([
                            new HtmlWidget(`
			<div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg border-b border-hover pb-2">
						Search
					</h3>
					<div id="search-container" class="flex flex-col sm:flex-row gap-4 mt-4">
						<input type="text" id="search-people" name="tournament-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-hover sm:text-sm">
						<button id="search-users-btn" class="bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md">Search</button>
					</div>
					<div id="search-users-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
					</div>
					<div id="search-pagination" class="hidden flex justify-between items-center p-4 border-t border-gray-200">
						<button disabled="${state.offset == 0}" id="prev-search-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
						<span id="search-page-info" class="text-sm">Page ${currentPage} of ${totalPages}</span>
						<button id="next-search-page" disabled="${state.offset + SEARCH_LIMIT >= SEARCH_LIMIT}" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
					<button id="close-search-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
        `, this.widget.parentId),
                            new SearchResults('search-users-list', state.results?.users ?? [], state.status == SearchStatus.Error),
                        ]);
                    }
                })
        });
    }

}