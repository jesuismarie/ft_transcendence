import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {Constants} from "@/core/constants/constants";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {UniqueKey} from "@/core/framework/core/key";

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
    constructor(public params: PaginationParams) {
        super();
    }
    build(context: BuildContext): Widget {
        const totalPages = Math.ceil((this.params.totalCount) / this.params.limit);
        const currentPage = this.params.totalCount === 0 ? 0 : Math.floor(this.params.offset / this.params.limit) + 1;
        console.log(`TOTALLL:::: ${totalPages} ${this.params.totalCount}`)
        return this.params.isHidden ? new HtmlWidget(``, this.params.parentId) : new DependComposite({dependWidgets: [new HtmlWidget(`
            <div id="${this.params.id ?? ""}" class="flex justify-between items-center p-4 border-t border-gray-200">
            <div id="${this.params.previousId}"></div>
              <span class="text-sm mx-2">Page ${currentPage} of ${totalPages}</span>
              <div id="${this.params.nextId}"></div>
            </div>
          `, )],
            children: [
                new SubmitButton({
                    id: `${this.params.nextId}-btn`,
                    className: "text-sm px-3 py-1 border rounded disabled:opacity-50",
                    disabled: false,
                    isHidden: false,
                    // disabled: this.params.offset + this.params.limit >= (this.params.totalCount),
                    onClick: this.params.onNextPage,
                    label: "Next",
                    parentId: this.params.nextId
                }),
                new SubmitButton({
                    id: `${this.params.previousId}-btn`,
                    className: "text-sm px-3 py-1 border rounded disabled:opacity-50",
                    disabled: this.params.offset == 0,
                    onClick: this.params.onPreviousPage,
                    label: "Previous",
                    parentId: this.params.previousId
                })
            ],
            parentId: this.params.parentId
        })
    }
}