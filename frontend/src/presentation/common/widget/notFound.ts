import {StatelessWidget} from "@/core/framework/statelessWidget";
import {BuildContext} from "@/core/framework/buildContext";
import {Widget} from "@/core/framework/base";
import {HtmlWidget} from "@/core/framework/htmlWidget";

export class NotFoundWidget extends StatelessWidget {
    build(context: BuildContext): Widget {
        return new HtmlWidget(`
            <div class="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center text-center">
      <h1 class="wipe-text neon-text flex gap-0 overflow-hidden text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[8rem] font-bold select-none text-primary animate-neonGlow"> 404 Not Found </h1>
    </div>`);
    }
}
