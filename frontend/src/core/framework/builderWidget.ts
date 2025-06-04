import {StatelessWidget} from "@/core/framework/statelessWidget";
import  {type BuildContext} from "@/core/framework/buildContext";
import  {type Widget} from "@/core/framework/base";

export class BuilderWidget extends  StatelessWidget{
    constructor(public builder: (context: BuildContext) => Widget) {
        super();
    }

    build(context: BuildContext): Widget {
        return this.builder(context);
    }


}