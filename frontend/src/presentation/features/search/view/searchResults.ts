import type {User} from "@/domain/entity/user";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {Composite} from "@/core/framework/widgets/composite";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {SearchItem} from "@/presentation/features/search/view/searchItem";
import type {Widget} from "@/core/framework/core/base";
import type {SearchUser} from "@/domain/entity/searchUser";

export class SearchResults extends StatelessWidget {

    constructor(public users: SearchUser[], public parentId?: string, public hasError: boolean = false) {
        super();
        this.users = users;
        this.parentId = parentId;
        this.hasError = hasError;
    }

    build(context: BuildContext): Widget {
        if (this.hasError) {
            return new HtmlWidget(`<p class="text-red-500 p-4">Failed to load users.</p>`, this.parentId);
        }
        return this.users.length === 0
            ? new HtmlWidget(`<p class="text-gray-500 p-4">No users found.</p>`, this.parentId)
            : new Composite(this.users.map((e: SearchUser) => new SearchItem(e)), this.parentId);
    }
}
