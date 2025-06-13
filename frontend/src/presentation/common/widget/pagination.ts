import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {Constants} from "@/core/constants/constants";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {SubmitButton} from "@/presentation/common/widget/submitButton";

export interface PaginationParams {
    isHidden: boolean;
    offset: number;
    limit: number;
    id: string
    totalCount: number;
    nextId: string;
    previousId: string;
    onNextPage: () => void;
    onPreviousPage: () => void;
    parentId?: string
}

export class Pagination extends StatelessWidget {
    constructor(public params: PaginationParams, public parentId?: string) {
        super();
    }
    build(context: BuildContext): Widget {
        const totalPages = Math.ceil((this.params.totalCount) / this.params.limit);
        const currentPage = Math.floor(this.params.offset / this.params.limit) + 1;
        console.log(`TOTALLL:::: ${totalPages}`)
        return this.params.isHidden ? new HtmlWidget(``) : new DependComposite({dependWidgets: [new HtmlWidget(`
            <div id="${this.params.id ?? ""}" class="flex justify-between items-center p-4 border-t border-gray-200">
              <button disabled="${this.params.offset === 0}" id="prev-search-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
              <span class="text-sm">Page ${currentPage} of ${totalPages}</span>
              <button id="next-search-page" disabled="${this.params.offset + this.params.limit >= (this.params.totalCount)}" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
          `, this.parentId)],
            children: [
                new SubmitButton({
                    id: `${this.params.nextId}`,
                    className: "text-sm px-3 py-1 border rounded disabled:opacity-50",
                    disabled: this.params.offset + this.params.limit >= (this.params.totalCount),
                    onClick: this.params.onNextPage,
                    label: "Next",
                }, this.params.id),
                new SubmitButton({
                    id: `${this.params.previousId}`,
                    className: "text-sm px-3 py-1 border rounded disabled:opacity-50",
                    disabled: this.params.offset + this.params.limit >= (this.params.totalCount),
                    onClick: this.params.onPreviousPage,
                    label: "Next",
                }, this.params.id)
            ]})
    }
}