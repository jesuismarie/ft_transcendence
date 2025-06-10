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
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {TextController} from "@/core/framework/controllers/textController";
import {Constants} from "@/core/constants/constants";
import {TextInputWidget} from "@/presentation/common/widget/textInputWidget";
import {MountAwareComposite} from "@/core/framework/widgets/mountAwareComposite";
import {ModalsBloc} from "@/presentation/features/modals/bloc/modalsBloc";
import {ModalsState} from "@/presentation/features/modals/bloc/modalsState";
import {DependWidget} from "@/core/framework/widgets/dependWidget";
import {DependComposite} from "@/core/framework/widgets/dependComposite";


export class SearchUserModal extends StatefulWidget {
    constructor(public searchController: TextController, public parentId?: string, ) {
        super();
    }

    createState(): State<SearchUserModal> {
        return new SearchUserModalState();
    }

}


export class SearchUserModalState extends State<SearchUserModal> {

    didMounted(context: BuildContext) {
        super.didMounted(context);
        this.setup(context);
    }

    dispose() {
        super.dispose();
        this.widget.searchController.close();
    }


    setup(context: BuildContext) {
        const searchBloc = context.read(SearchBloc)

        const searchBtn = document.getElementById('search-users-btn');
        const nextBtn = document.getElementById('next-search-page');
        const prevBtn = document.getElementById('prev-search-page');
        const closebtn = document.getElementById('close-search-modal');


        searchBtn?.addEventListener('click', e => {
            const query = this.widget.searchController.text
            if (!searchBloc.isClosed) {
                if (query) {
                    searchBloc.searchUser(query, searchBloc.state.offset, Constants.search_limit).then(r => r);
                }
            }
        })

        nextBtn?.addEventListener('click', async (e) => {
            const query = this.widget.searchController.text
            // const query = searchBloc.state.query.trim();
            if (query && searchBloc.state.offset + Constants.search_limit < (searchBloc.state.results?.totalCount ?? 0)) {
                await searchBloc.searchUser(query, searchBloc.state.offset + Constants.search_limit, Constants.search_limit);
            }
        })

        prevBtn?.addEventListener('click', async (e) => {
            const query = this.widget.searchController.text
            // const query = searchBloc.state.query.trim();
            if (query && searchBloc.state.offset >= Constants.search_limit) {
                await searchBloc.searchUser(query, searchBloc.state.offset - Constants.search_limit, Constants.search_limit);
            }
        })

        closebtn?.addEventListener('click', e => {
            hideModal(ModalConstants.searchModalName)
        })
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
          <button id="search-users-btn" class="bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md">Search</button>
        </div>
        <div id="search-users-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200"></div>
        <div id="search-pagination-container"></div>
      </div>
      <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
        <button id="close-search-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
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

                        new BlocBuilder<SearchBloc, SearchState>({
                            blocType: SearchBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => {
                                // this.setup(context);
                                const totalPages = Math.ceil((state.results?.totalCount ?? 0) / Constants.search_limit);
                                const currentPage = Math.floor(state.offset / Constants.search_limit) + 1;

                                return new Composite([
                                    new SearchResults(state.results?.users ?? [], 'search-users-list', state.status === SearchStatus.Error),
                                    new HtmlWidget(`
            <div id="search-pagination" class="${state.results?.totalCount > Constants.search_limit ? '' : 'hidden'} flex justify-between items-center p-4 border-t border-gray-200">
              <button disabled="${state.offset === 0}" id="prev-search-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              <span class="text-sm">Page ${currentPage} of ${totalPages}</span>
              <button id="next-search-page" disabled="${state.offset + Constants.search_limit >= (state.results?.totalCount ?? 0)}" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          `,)
                                ],);
                            },
                            parentId: "search-pagination-container"
                        })

                    ]
        });
    }

}