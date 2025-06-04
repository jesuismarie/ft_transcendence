import {StatelessWidget} from "@/core/framework/statelessWidget";
// import {type Widget} from "@/core/framework/widget";
import type {BuildContext} from "@/core/framework/buildContext";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import type {QuickUserResponse} from "@/utils/types";
import {SearchItem} from "@/presentation/common/widget/searchItem";
import {Composite} from "@/core/framework/composite";
import type {Widget} from "@/core/framework/base";

export class SearchResults extends StatelessWidget {
    constructor(public key: string, public users: QuickUserResponse[], public hasError: boolean = false) {
        super();
    }

    build(context: BuildContext): Widget {
        if (this.hasError) {
            return new HtmlWidget(`<p class="text-red-500 p-4">Failed to load users.</p>`);
        }
        return this.users.length === 0 ? new HtmlWidget(`
            <p class="text-gray-500 p-4">No users found.</p>`, this.key) :
                new Composite(this.users.map((e: QuickUserResponse) => new SearchItem(e)));
    }


}