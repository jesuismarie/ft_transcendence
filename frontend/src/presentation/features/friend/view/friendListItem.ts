import {StatelessWidget} from "@/core/framework/statelessWidget";
import  {type BuildContext} from "@/core/framework/buildContext";
import type {Widget} from "@/core/framework/base";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {Navigator} from "@/core/framework/navigator";

export class FriendListItem extends StatelessWidget {
    constructor(private id: string, private username: string, private avatarUrl?: string) {
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
			<img src="${this.avatarUrl}" alt="${this.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
			<span>${this.username}</span>
		</div>`);
    }

}