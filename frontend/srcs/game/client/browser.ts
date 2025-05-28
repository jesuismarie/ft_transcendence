import { init } from "./init";
import { CanvasRender } from "./lib/canvas";

document.addEventListener('DOMContentLoaded', () => {

    // document.getElementById("startgame")?.addEventListener('click', () => {
        init(CanvasRender(640,480, document.getElementById('gamecontainer')));
    // })
});


