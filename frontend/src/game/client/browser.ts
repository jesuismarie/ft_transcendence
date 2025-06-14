import {init} from "./init";
import {CanvasRender} from "./lib/canvas";
import type {BuildContext} from "@/core/framework/core/buildContext";

// document.addEventListener('DOMContentLoaded', () => {
//
//     // document.getElementById("startgame")?.addEventListener('click', () => {
//     //     init(CanvasRender(640,480, document.getElementById('gamecontainer')));
//     // })
// });


export function initPongGame(context: BuildContext) {
        const container = document.getElementById('gamecontainer');
        if (container) {
                const aspectRatio = 16 / 9;
                const width = container.clientWidth;
                const height = width / aspectRatio;

                const canvas = CanvasRender(width, height, container);
                init(canvas).then(() => {});

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
}

