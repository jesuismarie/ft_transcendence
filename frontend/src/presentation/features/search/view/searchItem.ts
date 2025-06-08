import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {Navigator} from "@/core/framework/widgets/navigator";
import type {Widget} from "@/core/framework/core/base";
import type {SearchUser} from "@/domain/entity/searchUser";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {ModalsBloc} from "@/presentation/features/modals/bloc/modalsBloc";
import {ModalsState} from "@/presentation/features/modals/bloc/modalsState";
import {SearchBloc} from "@/presentation/features/search/logic/searchBloc";
import {SearchState} from "@/presentation/features/search/logic/searchState";

export class SearchItem extends StatelessWidget {
    constructor(public user: SearchUser) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        this.setup(context);
    }

    setup(context: BuildContext) {
        const search = document.getElementById(`search-item-${this.user.id}`);
        search?.addEventListener('click', async () => {
            const authBloc = context.read(AuthBloc);
            const userId = authBloc.state.user?.userId;
            console.log(`USERRRRRR ${authBloc} ${this.user}`);
            if (this.user.id == userId) {
                alert('tut azaxodit');
                Navigator.of(context).pushNamed('/profile')
            }
            else {
                Navigator.of(context).pushNamed(`/profile/${this.user.id}`);
            }
        })
    }


    build(context: BuildContext): Widget {
        return new BlocListener<SearchBloc, SearchState>({
            blocType: SearchBloc,
            listener: (context: BuildContext, state) => {
                this.setup(context);
            },
            child: new BlocListener<ModalsBloc, ModalsState>({
                blocType: ModalsBloc,
                listener: (context: BuildContext, state) => {
                    this.setup(context);
                },
                child: new HtmlWidget(`
    <div id="search-item-${this.user.id}" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
        <img src="${this.user.avatarPath}" alt="${this.user.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
        <span>${this.user.username}</span>
    </div>`)
            })
        })
    }

}