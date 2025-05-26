

import { Ball } from "./lib/ball";
import { connectSocket } from "./lib/connectSocket";
import { gameTable } from "./lib/gameTable";
import { PlayerFactory } from "./lib/player";
import { score } from "./lib/score";
import socket from "./socket";
import { BallModel, CanvasPongContext, GameTableModel, PlayerModel, Score } from "./types";

let animationFrameId: number | null = null;

export const init = async ( gameCanvas: CanvasPongContext ) => {
    
    const gameScore = score(gameCanvas);
    const gameTableInstance = gameTable(gameCanvas, 2, 20);

    const leftPlayer = PlayerFactory(gameCanvas, 20, {up: "w", down: "s"});
    const rightPlayer = PlayerFactory(gameCanvas, gameCanvas.getWidth() - 40, {up: "ArrowUp", down: "ArrowDown"});
    const ball = Ball(gameCanvas, leftPlayer, rightPlayer, gameScore);

    let playerId: "left" | "right" | null = null;

    
    socket.on("player:joined", (data: {playerId: "left" | "right"}) => {
        playerId = data.playerId; 
    });

    socket.on("game:start", () => {
        gameCanvas.onEvent();

        const isBallHost = playerId === 'left';

        setInterval(() => {
            const player = playerId === "left" ? leftPlayer : rightPlayer;
            socket.emit("player:move", { playerId, x: player.x, y: player.y, width: player.width, height: player.height });
        })

        socket.on("ball:update", (data: any) => {
            if (isBallHost) return; // host does not accept updates from others
        
            // ball.x = data.x;
            // ball.y = data.y;
            // ball.velocity = data.velocity;
        
            gameScore.left = data.score.left;
            gameScore.right = data.score.right;
        });

        process(gameCanvas, leftPlayer, rightPlayer, ball, gameScore, gameTableInstance);
        
    });


    socket.on("game:state", ({ballS, playersS, scoreS}: {ballS: {x: number ,y: number, velocity: { x: number; y: number; }}, playersS: { left: {x: number ,y: number}, right: {x: number ,y: number} }, scoreS: {left: number, right: number}}) => {
        
        ball.x = ballS.x;
        ball.y = ballS.y;
        ball.velocity = ballS.velocity;   
        
        gameScore.left = scoreS.left;
        gameScore.right = scoreS.right;
        
    });
    


    socket.on("player:move", (data: { playerId: "left" | "right"; y: number }) => {
        if (!playerId) return;
        // Only update opponent's paddle
        if (data.playerId !== playerId) {
          const opponent = data.playerId === "left" ? leftPlayer : rightPlayer;
          opponent.y = data.y;
        }
    });

    socket.on("game:waiting", () => {        
        stopGameLoop();
        renderCenterText(gameCanvas);
    });

    socket.on("game:finish", (data: {message: string, win: boolean, draw: boolean}) => {        
        stopGameLoop();
        renderCenterText(gameCanvas, data.message);
    });

    socket.on("game:countdown", (data: {remaining: number}) => {        
        stopGameLoop();
        startCountDown(gameCanvas, data.remaining, () => {

        });
    });


    socket.on("game:full", () => {
        stopGameLoop();
        renderCenterText(gameCanvas, "Game is full!");
    })

    
    leftPlayer.update = function(){
        if( playerId == "left" ){
            const keyState = gameCanvas.getKeyState();
            if( keyState["ArrowUp"] ) this.y -= 7;
            if( keyState["ArrowDown"] ) this.y += 7;
    
            this.y = Math.max( Math.min(this.y, gameCanvas.getHeight() - this.height), 0 )
        }
    }

    rightPlayer.update = function(){
        if( playerId == "right" ){
            const keyState = gameCanvas.getKeyState();
            if( keyState["ArrowUp"] ) this.y -= 7;
            if( keyState["ArrowDown"] ) this.y += 7;
    
            this.y = Math.max( Math.min(this.y, gameCanvas.getHeight() - this.height), 0 )
        }
    }

    
}

const process = (gameCanvas: CanvasPongContext, leftPlayer: PlayerModel, rightPlayer: PlayerModel, ball: BallModel, score: Score, gameTableInstance: GameTableModel) => {
    const ctx = gameCanvas.getContext();
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, gameCanvas.getWidth(), gameCanvas.getHeight());
    ctx.restore();
    
    update(gameCanvas, leftPlayer, rightPlayer, ball);
    draw(gameCanvas, leftPlayer, rightPlayer, score, gameTableInstance, ball);
    animationFrameId = requestAnimationFrame( () => process(gameCanvas, leftPlayer, rightPlayer, ball, score, gameTableInstance) );
}

const stopGameLoop = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
};

const renderCenterText = (gameCanvas: CanvasPongContext, text: string = "Waiting for opponent...") => {
    const ctx = gameCanvas.getContext();

    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, gameCanvas.getWidth(), gameCanvas.getHeight());
    ctx.restore();
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "40px Kode Mono";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text,  (gameCanvas.getWidth() - textWidth) / 2, gameCanvas.getHeight() / 2);
    ctx.restore();
}


const startCountDown = (gameCanvas: CanvasPongContext, count: number, callback: () => void) => {
    const ctx = gameCanvas.getContext();

    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0, gameCanvas.getWidth(), gameCanvas.getHeight());

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "60px Kode Mono";
    const text = count > 0 ? count.toString() : "Go!";
    const textWidth = ctx.measureText(text).width;

    ctx.fillText(text, (gameCanvas.getWidth() - textWidth) / 2, gameCanvas.getHeight() / 2);
}

const update = function(gameCanvas: CanvasPongContext, leftPlayer: PlayerModel, rightPlayer: PlayerModel, ball: BallModel | null){
    leftPlayer.update();
    rightPlayer.update();
    
}

const draw = function(gameCanvas: CanvasPongContext, leftPlayer: PlayerModel, rightPlayer: PlayerModel, score: Score, gameTableInstance: GameTableModel, ball: BallModel | null){
    const ctx = gameCanvas.getContext();
    ctx.fillStyle = "#000";
    ctx.fillRect(0,0,gameCanvas.getWidth(), gameCanvas.getHeight());

    ctx.save();


    score.draw();
    leftPlayer.draw();
    rightPlayer.draw();
    if(ball) ball.draw();
    gameTableInstance.draw();
  
}