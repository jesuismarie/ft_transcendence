import {StatelessWidget} from "@/core/framework/statelessWidget";
import  {type BuildContext} from "@/core/framework/buildContext";
import type {Widget} from "@/core/framework/base";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {State, StatefulWidget} from "@/core/framework/statefulWidget";

export interface TextInputWidgetProps {
    type?: string;
    id?: string;
    name?: string;
    className?: string,
    onChange: (value: string) => void,
}

export class TextInputWidget extends StatefulWidget {
    constructor(public props: TextInputWidgetProps) {
        super();
    }
    createState(): State<TextInputWidget> {
        return new TextInputWidgetState();
    }

}

export class TextInputWidgetState extends State<TextInputWidget> {


    afterMounted(context: BuildContext) {
        super.afterMounted(context);
        const elem = document.getElementById(`${this.widget.props.id}`);
        elem?.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.widget.props.onChange(target.value.trim())
        })
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
            <input type="${this.widget.props.type}" id="${this.widget.props.id}" value="${this.widget.props.name}" class="${this.widget.props.className}" />
        `);
    }

}