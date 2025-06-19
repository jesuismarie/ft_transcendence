import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";

export interface SubmitButtonParams {
	parentId?: string;
	className?: string;
	label?: string;
	id?: string;
	disabled?: boolean;
	isHidden?: boolean;
	onClick?: (e?: HTMLElement | null) => void;
}

export class SubmitButton extends  StatelessWidget {
	constructor(public params: SubmitButtonParams) {
		super();
	}
	didMounted(context: BuildContext) {
		super.didMounted(context);
		console.log(`<<<<<<<<<<<<:::: ${this}`);
		const elem = this.params.id ? document.getElementById(this.params.id) : null;
		console.log(`EEEEE:::: ${elem} ${this.params.id}`)
		// @ts-ignore
		elem?.addEventListener('click', (e: Event) => {
			e.preventDefault();
			if (this.params.onClick) {
				this.params.onClick(elem);
			}
		})
	}
	
	build(context: BuildContext): Widget {
		console.log(`RRRRRRRRRRR:::: ${JSON.stringify(this.params)}`);
		return this.params.isHidden ? new HtmlWidget(``, this.params.parentId) : new HtmlWidget(`
            <button ${this.params.disabled ? "disabled" : ""} id="${this.params.id ?? ""}" class="${this.params.className ?? ""}">${this.params.label ?? ""}</button>
        `, this.params.parentId);
	}
	
}