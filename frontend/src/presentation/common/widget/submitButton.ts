import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";

export interface SubmitButtonParams {
    parentId?: string;
    className?: string;
    label?: string;
    id?: string
    isHidden?: boolean;
    onClick?: () => void;
}

export class SubmitButton extends  StatelessWidget {
    constructor(public params: SubmitButtonParams, public parentId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);

        const elem = this.params.id ? document.getElementById(this.params.id) : null;
        elem?.addEventListener('click', (e: Event) => {
            if (this.params.onClick) {
                this.params.onClick();
            }
        })
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
            <button id="${this.params.id ?? ""}" class="${this.params.isHidden ? "hidden" : ""} ${this.params.className ?? ""}">${this.params.label ?? ""}</button>
        `, this.parentId);
    }

}