import { init } from "./init";
import { CanvasRender } from "./lib/canvas";

document.addEventListener('DOMContentLoaded', () => {
        const container = document.getElementById('gamecontainer');
        if (container) {
                const aspectRatio = 16 / 9;
                const containerWidth = container.clientWidth;
                const width = containerWidth;
                const height = width / aspectRatio;

                const canvas = CanvasRender(width, height, container);
                init(canvas);

                window.addEventListener('resize', () => {
                        const canvasElement = canvas.getContext().canvas;
                        const newWidth = container.clientWidth;
                        const newHeight = newWidth / aspectRatio;

                        canvasElement.width = newWidth;
                        canvasElement.height = newHeight;

                        canvasElement.style.width = `${newWidth}px`;
                        canvasElement.style.height = `${newHeight}px`;
                });
        }
    // document.getElementById("startgame")?.addEventListener('click', () => {
    //     init(CanvasRender(640,480, document.getElementById('gamecontainer')));
    // })
});


