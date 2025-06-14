

import { Ball } from "./lib/ball";
import { gameTable } from "./lib/gameTable";
import { PlayerFactory } from "./lib/player";
import { score } from "./lib/score";
import { connectSocket } from "./connectSocket";
import type { BallModel, CanvasPongContext, GameTableModel, PlayerModel, Score } from "./types";
import { Messages } from "./lib/messages";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {Navigator} from "@/core/framework/widgets/navigator";
import {MatchBloc} from "@/presentation/features/match/bloc/match_bloc";

let animationFrameId: number | null = null;
let moveInterval: ReturnType<typeof setInterval> | null = null;
let isViewer = false;

export const init = async ( gameCanvas: CanvasPongContext, context: BuildContext ) => {
    
    const gameScore = score(gameCanvas);
    const gameTableInstance = gameTable(gameCanvas, 2, 20);

    const leftPlayer = PlayerFactory(gameCanvas, 20, {up: "w", down: "s"});
    const rightPlayer = PlayerFactory(gameCanvas, gameCanvas.getWidth() - 40, {up: "ArrowUp", down: "ArrowDown"});
    const ball = Ball(gameCanvas, leftPlayer, rightPlayer, gameScore);

    let playerId: "left" | "right" | null = null;

    const [ , ,matchId, username ] = window.location.pathname.split('/');
    console.log(`URLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL:::: ${window.location.pathname.split('/')} ${matchId}, ${username}`);
    const socket = connectSocket(matchId, username);

    socket.on("viewer:joined", () => {
        isViewer = true;
    });
    
    socket.on("player:joined", (data: {playerId: "left" | "right"}) => {  
        if (!isViewer) {
            playerId = data.playerId; 
            bindPlayerControls(gameCanvas, playerId, leftPlayer, rightPlayer);
        }      
    });

    socket.on("game:start", () => {    
        gameCanvas.clearMessage(); 
        if (!isViewer) {
            gameCanvas.onEvent();
            startMovementEmitter(socket, playerId, leftPlayer, rightPlayer);
        }

        const isBallHost = playerId === 'left';

        
        socket.on("ball:update", (data: any) => {
            if (isBallHost) return; // host does not accept updates from others
    
        
            gameScore.left = data.score.left;
            gameScore.right = data.score.right;
        });

        process(gameCanvas, leftPlayer, rightPlayer, ball, gameScore, gameTableInstance);
        
    });


    socket.on("game:state", ({ballS, playersS, scoreS}: {ballS: {x: number ,y: number, velocity: { x: number; y: number; }}, playersS: { left: {x: number ,y: number}, right: {x: number ,y: number} }, scoreS: {left: number, right: number}}) => {
        ball.x = ballS.x;
        ball.y = ballS.y;
        ball.velocity = ballS.velocity;

        //Only viewer need to see the update of paddle from the server
        if(isViewer){
            leftPlayer.y = playersS.left.y;
            rightPlayer.y = playersS.right.y;
        }

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
        gameCanvas.setMessage(Messages.waiting);
        renderCenterText(gameCanvas);
    });


    socket.on("game:error", (data: {message: string}) => {                 
        stopGameLoop();
        gameCanvas.setMessage(data.message);
        renderCenterText(gameCanvas);
    });


    socket.on("game:pause", (data: {message: string}) => {        
        stopGameLoop();
        gameCanvas.setMessage(data.message);
        renderCenterText(gameCanvas, data.message);
        
    })

    socket.on("game:resume", (data) => {
        gameCanvas.setMessage( data.message || "Game resuming...");
        renderCenterText(gameCanvas, data.message || "Game resuming...");
        
        
        bindPlayerControls(gameCanvas, playerId, leftPlayer, rightPlayer);

        gameCanvas.onEvent();
        //Calibrating  positon of players paddle from the server
        if (playerId === "left") {
            leftPlayer.y = data.leftY;
        } else if (playerId === "right") {
            rightPlayer.y = data.rightY;
        }

        startMovementEmitter(socket, playerId, leftPlayer, rightPlayer);
    })

    socket.on("game:finish", (data: {message: string, win: boolean, draw: boolean}) => {        
        stopGameLoop();
        gameCanvas.setMessage(data.message);
        renderCenterText(gameCanvas, data.message);
        // context.read(MatchBloc).next()
        // Navigator.of(context).pushNamed('/profile');
    });

    socket.on("game:countdown", (data: {remaining: number}) => {                
        stopGameLoop();
        gameCanvas.setMessage(data.remaining.toString());
        startCountDown(gameCanvas, data.remaining, () => {});
    });


    socket.on("game:full", () => {
        stopGameLoop();
        gameCanvas.setMessage("Game is full!");
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

const bindPlayerControls = (gameCanvas: CanvasPongContext, playerId: string | null, leftPlayer: PlayerModel, rightPlayer: PlayerModel) => {
    if (isViewer) return; 
    if (playerId === "left") {
      leftPlayer.update = function () {
        const keys = gameCanvas.getKeyState();
        if (keys["ArrowUp"]) this.y -= 7;
        if (keys["ArrowDown"]) this.y += 7;
        this.y = Math.max(Math.min(this.y, gameCanvas.getHeight() - this.height), 0);
      };
    }
  
    if (playerId === "right") {
      rightPlayer.update = function () {
        const keys = gameCanvas.getKeyState();
        if (keys["ArrowUp"]) this.y -= 7;
        if (keys["ArrowDown"]) this.y += 7;
        this.y = Math.max(Math.min(this.y, gameCanvas.getHeight() - this.height), 0);
      };
    }
}

const startMovementEmitter = (socket: any, playerId: string | null, leftPlayer: PlayerModel, rightPlayer: PlayerModel) => {
    if (isViewer) return; 
    if (moveInterval) clearInterval(moveInterval);
    
    moveInterval = setInterval(() => {
      const player = playerId === "left" ? leftPlayer : rightPlayer;
      socket.emit("player:move", {
        playerId,
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height,
      });
    }, 1000 / 60); // send 20 times per second
  };

const process = (gameCanvas: CanvasPongContext, leftPlayer: PlayerModel, rightPlayer: PlayerModel, ball: BallModel, score: Score, gameTableInstance: GameTableModel) => {
    const ctx = gameCanvas.getContext();
    ctx.fillStyle = '#03102a';
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
    console.log("WAITTTTT")

    ctx.fillStyle = '#03102a';
    ctx.fillRect(0,0, gameCanvas.getWidth(), gameCanvas.getHeight());
    ctx.restore();
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Kode Mono";
    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text,  (gameCanvas.getWidth() - textWidth) / 2, gameCanvas.getHeight() / 2);
    ctx.restore();
}


const startCountDown = (gameCanvas: CanvasPongContext, count: number, callback: () => void) => {
    const ctx = gameCanvas.getContext();
    console.log("COUNTERRRR::::: ")
    ctx.fillStyle = "#03102a";
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
    ctx.fillStyle = "#03102a";
    ctx.fillRect(0,0,gameCanvas.getWidth(), gameCanvas.getHeight());

    ctx.save();


    score.draw();
    leftPlayer.draw();
    rightPlayer.draw();
    if(ball) ball.draw();
    gameTableInstance.draw();
  
}