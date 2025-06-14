import type { CanvasPongContext, KeyState } from "../types";

export const CanvasRender = ( width: number, height: number, targetDOM: HTMLElement | null ): CanvasPongContext => {

    // const style = document.createElement("style");
    // style.innerHTML = `
    //     .pong_game {
    //         position: relative;
    //         width: 100%;
    //         height: 100%;
    //     }
    //
    //     .pong_game_box {
    //         position: absolute;
    //         top: 0;
    //         left: 0;
    //         right: 0;
    //         bottom: 0;
    //         opacity: 100;
    //         z-index: 2;
    //         background: rgba(0, 0, 0, 0.5);
    //         display: flex;
    //         align-items: center;
    //         justify-content: center;
    //     }
    //
    //     .pong_game_box.show_message_box {
    //         display: flex;
    //     }
    //
    //     .pong_game_box_content {
    //         color: white;
    //         text-align: center;
    //         font-size: 20px;
    //     }
    //
    //     .pong_game_box_content_logo img {
    //         max-width: 100px;
    //         margin-bottom: 1rem;
    //     }
    // `;
    // document.head.appendChild(style);
    const containerElement: HTMLDivElement = document.createElement('div');
    containerElement.classList.add("pong_game");
    
    //Create, Initiate and Append game canvas element
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    //Create element for showing messages
    const messageElement: HTMLDivElement = document.createElement('div');
    messageElement.classList.add("pong_game_box");

    const messageElementContent: HTMLDivElement = document.createElement('div');
    messageElementContent.classList.add("pong_game_box_content");

    const messageElementContentLogo: HTMLDivElement = document.createElement('div');
    messageElementContentLogo.classList.add("pong_game_box_content_logo");
    messageElementContentLogo.innerHTML = `<img src="/images/pong_logo_2.png" alt="ss" style="max-height: 50px; width: auto;"/>`

    const messageElementContentText: HTMLDivElement = document.createElement('div');
    messageElementContentText.classList.add("pong_game_box_content_text");

    messageElementContent.appendChild(messageElementContentLogo);
    messageElementContent.appendChild(messageElementContentText);
    messageElement.appendChild(messageElementContent);
    
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

    //Add canvas to container element
    containerElement.appendChild(canvas);

    //Add messagebox to container element
    containerElement.appendChild(messageElement);

    if(targetDOM){
        targetDOM.appendChild(containerElement);
    }else {
        document.body.appendChild(containerElement);
    }

    ctx.fillStyle = "#03102a";
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
        },
        setMessage(message: string){
            messageElement.classList.add('show_message_box');
            messageElementContentText.innerHTML = message;
        },

        clearMessage(){
            messageElement.classList.remove('show_message_box');
            messageElementContentText.innerHTML = "";
        }
        
    };
}