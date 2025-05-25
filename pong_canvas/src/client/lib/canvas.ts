import { CanvasPongContext, KeyState } from "../types";

export const CanvasRender = ( width: number, height: number ): CanvasPongContext => {
    //Create, Initiate and Append game canvas element
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    document.body.appendChild(canvas);

    ctx.fillRect(0,0,width, height);
    ctx.save();

    //Key State
    const keyState: KeyState = {};

    return {
        onEvent(){
            document.addEventListener("keydown", (event: KeyboardEvent) => {
                keyState[event.key] = true;                
            });

            document.addEventListener("keyup", (event: KeyboardEvent) => {
                delete keyState[event.key];
            });
        },
        getWidth(){
            return width
        },
        getHeight(){
            return height
        },
        getContext() {
            return ctx
        },
        getKeyState(){
            return keyState
        }
    };
}