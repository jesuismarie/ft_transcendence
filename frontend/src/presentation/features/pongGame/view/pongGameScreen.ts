import {StatelessWidget} from "@/core/framework/statelessWidget";
import {type BuildContext} from "@/core/framework/buildContext";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {initPongGame} from "@/game/client/browser";
import type {Widget} from "@/core/framework/base";

export class PongGameScreen extends StatelessWidget {
    afterMounted(context: BuildContext) {
        super.afterMounted(context);
        initPongGame(context);
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
    <div class="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center">
      <h1 class="overflow-hidden text-[1rem] sm:text-[2rem] md:text-[3rem] font-bold select-none text-primary"> Score </h1>
      <p class="flex gap-0 overflow-hidden text-[1rem] sm:text-[2rem] md:text-[3rem] font-bold select-none text-primary">
        <span id="player1-score">0</span> : <span id="player2-score">0</span>
      </p>
      <button id="startgame">START!</button>
      <canvas class="container bg-black border-5 border-solid border-white" id="gamecontainer"></canvas>
    </div>`);
    }
}