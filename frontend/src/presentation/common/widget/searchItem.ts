import {StatelessWidget} from "@/core/framework/statelessWidget";
import  {type BuildContext} from "@/core/framework/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import type {QuickUserResponse} from "@/utils/types";
import { initPersonalData } from "@/profile/profile";
import {ProfileBloc} from "@/presentation/profile/bloc/profileBloc";
import {Navigator} from "@/core/framework/navigator";
import type {Widget} from "@/core/framework/base";

export class SearchItem extends StatelessWidget {
    constructor(public user: QuickUserResponse) {
        super();
    }

    afterMounted(context: BuildContext) {
        super.afterMounted(context);
        const search = document.getElementById('search-item');
        search?.addEventListener('click', async () => {
            const profileBloc = context.read(ProfileBloc);
            const username = profileBloc.state.profile?.username;
            if (this.user.username == username) {
                Navigator.of(context).pushNamed('/profile')
            }
            else {
                Navigator.of(context).pushNamed(`/profile/${username}`);
            }
            // await initPersonalData(this.user.id);
        })
    }


    build(context: BuildContext): Widget {
        return new HtmlWidget(`
    <div id="search-item" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
        <img src="${this.user.avatarPath}" alt="${this.user.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
        <span>${this.user.username}</span>
    </div>`)
    }

}