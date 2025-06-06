import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {Navigator} from "@/core/framework/widgets/navigator";
import type {Widget} from "@/core/framework/core/base";
import type {SearchUser} from "@/domain/entity/searchUser";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";

export class SearchItem extends StatelessWidget {
    constructor(public user: SearchUser) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const search = document.getElementById('search-item');
        search?.addEventListener('click', async () => {
            const authBloc = context.read(AuthBloc);
            const userId = authBloc.state.user?.userId;
            console.log(`USERRRRRR ${authBloc} ${this.user}`);
            if (this.user.id == userId) {
                Navigator.of(context).pushNamed('/profile')
            }
            else {
                Navigator.of(context).pushNamed(`/profile/${userId}`);
            }
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