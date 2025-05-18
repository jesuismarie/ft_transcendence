import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { PlayerModel, Score } from './types';
import { createBall } from './ball';



const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 4000;

// Serve client assets
app.use(express.static(path.join(__dirname, '../client')));

let players: { [id: string]: 'left' | 'right' } = {};


const leftPlayer: PlayerModel = { x: 10, y: 250, width: 10, height: 100 };
const rightPlayer: PlayerModel = { x: 780, y: 250, width: 10, height: 100 };
const score: Score = { left: -1, right: 0, isGameStarted: false };
const scoreLimit = 10;

const ball = createBall(640, 480, leftPlayer, rightPlayer, score, scoreLimit);
ball.serve(1); // Start game

let gameLoop: NodeJS.Timeout;
let remainingInterval: NodeJS.Timeout;

io.on('connection', (socket) => {    
    //const token = socket.handshake.auth.token;

    // Example: decode JWT or look up user by token
    // const user = jwt.verify(token, YOUR_SECRET_KEY);

    // if (!user) {
    //     socket.disconnect(true);
    //     return;
    // }
    
    
    if( Object.keys(players).length >= 2 ){
        io.to(socket.id).emit('game:full');
        socket.disconnect(true);
        return;
    }

    console.log("Connection", Object.keys(players).length);

    const playerId = Object.values(players).includes('left') ? 'right' : 'left';
    players[socket.id] = playerId;
    console.log("Players", players);
    
    socket.emit('player:joined', {playerId});

    if( Object.keys(players).length === 1 ) io.to(socket.id).emit('game:waiting', { message: 'Waiting for opponent...' });

    if(Object.keys(players).length === 2){
        let remaining = 5;

        remainingInterval = setInterval(() => {
            remaining--;
            Object.keys(players).forEach((id) => {
                io.to(id).emit('game:countdown', { remaining });
            });

            if(remaining <= 0) {
                Object.keys(players).forEach((id) => {
                    io.to(id).emit('game:start');
                });
                startGame();
                clearInterval(remainingInterval);
            }
        },1000); 
        
    }

    socket.on("player:move", ({ playerId, x, y, width, height }) => {
        
        if (playerId === "left") {
            leftPlayer.x = x;
            leftPlayer.y = y;
        }else {
            rightPlayer.x = x;
            rightPlayer.y = y;
        }
        
        socket.broadcast.emit("player:move", { playerId, y });
    });

    socket.on("ball:update", (data) => {
        // Broadcast ball state to all other players
        socket.broadcast.emit("ball:update", data);
    });


    socket.on('disconnect', () => {        
        const disconnectedRole = players[socket.id];
        delete players[socket.id];

        clearInterval( gameLoop );
        clearInterval( remainingInterval );

        socket.broadcast.emit('player:disconnected', { playerId: disconnectedRole });

        scoring();
        
    })


    
});

const startGame = () => {
    score.isGameStarted = true;

    if(gameLoop) clearInterval(gameLoop);
            
    // Run the game loop
    gameLoop = setInterval(() => {
        
        ball.update();

        let hasWinner: null | 'left' | 'right' = ball.hasWinner();

        if(hasWinner){
            clearInterval( gameLoop );
            scoring();
        }

        Object.keys(players).forEach((id) => {                    
            io.to(id).emit("game:state", {
                ballS: { x: ball.x, y: ball.y, velocity: ball.velocity },
                playersS: {
                    left: { y: leftPlayer.y },
                    right: { y: rightPlayer.y },
                },
                scoreS: score,
            });
        })

    }, 1000 / 60); // 60 FPS
}

const scoring = () => {    
    if( !score.isGameStarted) return false;
    let playersKeys = Object.keys(players);
    let winnerPlayerId: string = ''; 
    
    if(playersKeys.length === 1){
        io.to(playersKeys[0]).emit('game:finish', { message: 'You win', win: true, draw: false });
    }else {
        let winner: string = score.left == score.right ? 'draw' : ( score.left > score.right ? 'left' : 'right' );    
        
        playersKeys.forEach((id) => {  
            if( players[id] == winner ){
                winnerPlayerId = id;
                io.to(id).emit('game:finish', { message: 'You win', win: true, draw: false });
            }else {
                if( winner == 'draw' ){
                    io.to(id).emit('game:finish', { message: 'It\'s a draw', win: false, draw: true });
                }else {
                    io.to(id).emit('game:finish', { message: 'You won', win: false, draw: false });
                }
            }    
        });
    }

    score.isGameStarted = false;

    sendReportToServer( winnerPlayerId );

    resetScores();
    clearPlayersSockets();
    
}

const clearPlayersSockets = () => {
    Object.keys(players).forEach((id) => {
        io.sockets.sockets.get(id)?.disconnect(true);
    });
    players = {};
}

const resetScores = () => {
    score.left = 0;
    score.right = 0;
}

const sendReportToServer = (winnerPlayerId: string) => {
    //TODO: Implement the final score submission to the server here.
    console.log(score, winnerPlayerId);
    
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})