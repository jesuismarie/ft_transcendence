import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {Composite} from "@/core/framework/widgets/composite";
import {SearchResults} from "@/presentation/features/search/view/searchResults";
import {hideModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {SearchBloc} from "@/presentation/features/search/logic/searchBloc";
import {type SearchState, SearchStatus} from "@/presentation/features/search/logic/searchState";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {type Widget} from "@/core/framework/core/base";
import {State, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import {TextController} from "@/core/framework/controllers/textController";
import {Constants} from "@/core/constants/constants";
import {TextInputWidget} from "@/presentation/common/widget/textInputWidget";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {Pagination} from "@/presentation/common/widget/pagination";


export class SearchUserModal extends StatefulWidget {
    constructor(public searchController: TextController, public parentId?: string,) {
        super();
    }

    createState(): State<SearchUserModal> {
        return new SearchUserModalState();
    }

}


export class SearchUserModalState extends State<SearchUserModal> {

    dispose() {
        super.dispose();
        this.widget.searchController.close();
    }

    build(context: BuildContext): Widget {
        return new DependComposite({
            dependWidgets: [
                new HtmlWidget(`
    <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
      <div class="px-4 pt-5 pb-4 sm:p-6">
        <h3 class="text-lg border-b border-hover pb-2">Search</h3>
        <div id="search-container" class="flex flex-col sm:flex-row gap-4 mt-4">
          <div id="search-people-container"></div>
          <div id="search-users-btn-container"></div>
        </div>
        <div id="search-users-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200"></div>
        <div id="search-users-container"></div>
        <div id="search-pagination-container"></div>
      </div>
      <div id="close-search-container" class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
      </div>
    </div>
  `, this.widget.parentId)],
            children: [

                new TextInputWidget({
                    type: "text",
                    id: "search-people",
                    className: "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-hover sm:text-sm",
                    name: "search-people",
                    controller: this.widget.searchController,
                    parentId: "search-people-container"
                }),

                new SubmitButton({
                    id: "close-search-modal",
                    className: "px-4 py-2 text-sm rounded-md border border-hover hover:text-hover",
                    isHidden: false,
                    label: "Close",
                    onClick: () => {
                        hideModal(ModalConstants.searchModalName)
                    },
                    parentId: "close-search-container"
                }),
                new SubmitButton({
                    label: "Search",
                    isHidden: false,
                    id: "search-users-btn",
                    onClick: () => {
                        const searchBloc = context.read(SearchBloc)
                        const query = this.widget.searchController.text
                        if (query) {
                            searchBloc.searchUser(query, searchBloc.state.offset, Constants.search_limit).then(r => r);
                        }
                    },
                    className: "bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md",
                    parentId: 'search-users-btn-container'
                }),
                new BlocBuilder<SearchBloc, SearchState>({
                    blocType: SearchBloc,
                    buildWhen: (oldState, newState) => !oldState.equals(newState),
                    builder: (context, state) => {
                        console.log(`LLLLLL::::::::: ${state.results.totalCount}`)
                        return new Composite([
                            new SearchResults(state.results.users, 'search-users-list', state.status === SearchStatus.Error),
                            new Pagination({
                                id: "search-pagination",
                                offset: state.offset,
                                totalCount: state.results.totalCount,
                                limit: Constants.search_limit,
                                onNextPage: async () => {
                                    const searchBloc = context.read(SearchBloc)
                                    const query = this.widget.searchController.text
                                    if (query && searchBloc.state.offset + Constants.search_limit < (searchBloc.state.results.totalCount)) {
                                        await searchBloc.searchUser(query, searchBloc.state.offset + Constants.search_limit, Constants.search_limit);
                                    }
                                },
                                onPreviousPage: async () => {
                                    const searchBloc = context.read(SearchBloc)
                                    const query = this.widget.searchController.text
                                    if (query && searchBloc.state.offset >= Constants.search_limit) {
                                        await searchBloc.searchUser(query, searchBloc.state.offset - Constants.search_limit, Constants.search_limit);
                                    }
                                },
                                isHidden: false,
                                nextId: 'next-search-page',
                                previousId: 'prev-search-page'
                            }, )
                        ],);
                    },
                    parentId: 'search-pagination-container'
                })

            ]
        });
    }

}