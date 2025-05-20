import { init } from "./init";
import { CanvasRender } from "./lib/canvas";

document.addEventListener('DOMContentLoaded', () => {
    init(CanvasRender(640,480));
});


