import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import  {type Widget} from "@/core/framework/core/base";

export class BuilderWidget extends  StatelessWidget{
    constructor(public builder: (context: BuildContext) => Widget) {
        super();
    }

    build(context: BuildContext): Widget {
        return this.builder(context);
    }


}