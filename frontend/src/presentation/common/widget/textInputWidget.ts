import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {State, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import type {TextController} from "@/core/framework/controllers/textController";

export interface TextInputWidgetProps {
    type?: string;
    id?: string;
    name?: string;
    className?: string,
    onChange?: (value: string) => void,
    controller: TextController,
    parentId?: string
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


    didMounted(context: BuildContext) {
        super.didMounted(context);
        const elem = document.getElementById(`${this.widget.props.id}`) as HTMLInputElement;

        this.widget.props.controller.bindInput(elem!);
        // elem?.addEventListener('input', (e) => {
        //     const target = e.target as HTMLInputElement;
        //     this.widget.props.onChange(target.value.trim())
        // })
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
            <input type="${this.widget.props.type}" id="${this.widget.props.id}" value="${this.widget.props.name}" class="${this.widget.props.className}" />
        `, this.widget.props.parentId);
    }

}