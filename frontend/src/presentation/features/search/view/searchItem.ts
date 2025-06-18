import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
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
        this.setup(context);
    }

    setup(context: BuildContext) {
        const search = document.getElementById(`search-item-${this.user.id}`);
        search?.addEventListener('click', async () => {
            const authBloc = context.read(AuthBloc);
            const userId = authBloc.state.user?.userId;
            if (this.user.id == userId) {
                Navigator.of(context).pushNamed('/profile')
                window.location.reload();
            }
            else {
                Navigator.of(context).pushNamed(`/profile/${this.user.id}`);
                window.location.reload();
            }
        })
    }


    build(context: BuildContext): Widget {
        return new HtmlWidget(`
    <div id="search-item-${this.user.id}" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
        <img src="${this.user.avatarPath ?? "/images/background1.jpg"}" crossOrigin="anonymous" onerror="this.onerror=null; this.src='/images/background1.jpg';" alt="${this.user.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
        <span>${this.user.username}</span>
    </div>`)
        }

}