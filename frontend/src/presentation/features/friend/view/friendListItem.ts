import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {Navigator} from "@/core/framework/widgets/navigator";

export class FriendListItem extends StatelessWidget {
    constructor(private id: string, private username: string, private avatarUrl: string | null) {
        super();
    }
    didMounted(context: BuildContext) {
        super.didMounted(context);
        const friendDetailsBtn = document.getElementById('friend-details-btn');
        friendDetailsBtn?.addEventListener('click', () => {
            Navigator.of(context).pushNamed(`/profile/${this.id}`);
        })
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
        <div id="friend-details-btn" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
			<img src="${this.avatarUrl ?? "/images/background1.jpg"}" onerror="this.onerror=null; this.src='/images/background1.jpg';" alt="${this.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
			<span>${this.username}</span>
		</div>`);
    }

}