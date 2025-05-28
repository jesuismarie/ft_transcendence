import { WebSocket } from "ws";
import { MatchPlayers } from "../types";
import { matches } from "./state";
import { startGameLoop } from "./loop";

export function handleViewer(ws: WebSocket, matchState: MatchPlayers){
    matchState.viewers.add(ws);
    ws.send(JSON.stringify({ event: 'viewer:joined' }));

    if ((matchState.player1 && !matchState.player2) || (!matchState.player1 && matchState.player2)){
        ws.send(JSON.stringify({ event: 'game:waiting' }));
    }

    if (matchState.score.isGameStarted) {
        ws.send(JSON.stringify({ event: 'game:start' }));
    }
    
    ws.on('close', () => {
        matchState.viewers.delete(ws);
    });
}

export function handlePlayer(
    ws: WebSocket,
    matchState: MatchPlayers,
    match_id: string,
    username: string,
    activeMatches: Map<string, MatchPlayers>
  ){
    const match = matches.find((m) => m.match_id === match_id);

    if (!match) {
        (ws as any).isRejected = true;
        ws.send(JSON.stringify({ event: 'game:error', data: {message: 'Invalid match or user' }}));
        ws.close();
        return;
    }

    if (
        (matchState.player1Username === username && matchState.player1?.readyState === WebSocket.OPEN) ||
        (matchState.player2Username === username && matchState.player2?.readyState === WebSocket.OPEN)
      ) {
        (ws as any).isRejected = true;
        ws.send(JSON.stringify({
          event: 'game:error',
          data: {message: 'User already connected'},
        }));
        ws.close();
        return;
    }

    // Attach player
    if (username === match.player1_id && !matchState.player1) {
        matchState.player1 = ws;
        matchState.player1Username = username;
        ws.send(JSON.stringify({ event: 'player:joined', data: { playerId: 'left' } }));
    } else if (username === match.player2_id && !matchState.player2) {
        matchState.player2 = ws;
        matchState.player2Username = username;
        ws.send(JSON.stringify({ event: 'player:joined', data: { playerId: 'right' } }));
    } else {
        (ws as any).isRejected = true;
        ws.send(JSON.stringify({ event: 'error', data: {message: 'User already connected' }}));
        ws.close();
        return;
    }

    //If reconnection during pause
    if( matchState.disconnectTimeout ){        
        clearTimeout(matchState.disconnectTimeout);
        matchState.disconnectTimeout = undefined;

        if (matchState.player1 && matchState.player2) {

            const resumeMessage = JSON.stringify({
                event: 'game:resume',
                data: { 
                    message: 'Game resumed!',
                    leftY: matchState.leftPlayer.y,
                    rightY: matchState.rightPlayer.y,
                },
            })

            matchState.player1?.send(resumeMessage);
            matchState.player2?.send(resumeMessage);

            if(matchState.viewers){
                matchState.viewers.forEach(viewer => {
                    if (viewer.readyState === WebSocket.OPEN) viewer.send(resumeMessage);
                });
            }
            setTimeout(() => {
                matchState.player1?.send(JSON.stringify({ event: 'game:start' }));
                matchState.player2?.send(JSON.stringify({ event: 'game:start' }));

                if(matchState.viewers){
                    matchState.viewers.forEach(viewer => {
                        if (viewer.readyState === WebSocket.OPEN) viewer.send(JSON.stringify({ event: 'game:start' }));
                    });
                }

                startGameLoop(match_id, matchState, activeMatches);
            },1000)
            
        }        
    }

     if (
        (matchState.player1 && !matchState.player2) ||
        (!matchState.player1 && matchState.player2)
        ) {
        ws.send(JSON.stringify({
            event: 'game:waiting',
            data: { message: 'Waiting for opponent...' },
        }));

        if(matchState.viewers){
            matchState.viewers.forEach(viewer => {
                if (viewer.readyState === WebSocket.OPEN) viewer.send(JSON.stringify({ event: 'game:waiting' }));
            });
        }
    }

    //Start game
    if (matchState.player1 && matchState.player2 && !matchState.score.isGameStarted) {
        let remaining = 5;

        matchState.countdownTimeout = setInterval(() => {
            const msg = JSON.stringify({ event: 'game:countdown', data: { remaining } });
            matchState.player1?.send(msg);
            matchState.player2?.send(msg);

            matchState.viewers.forEach(viewer => {                
                if (viewer.readyState === WebSocket.OPEN) viewer.send(msg);
                });
        
            if (remaining <= 0) {
                // Start the game
                clearInterval(matchState.countdownTimeout);
                matchState.score.isGameStarted = true;
                matchState.ball.serve(1);
                //Send start socket to the players
                matchState.player1?.send(JSON.stringify({ event: 'game:start' }));
                matchState.player2?.send(JSON.stringify({ event: 'game:start' }));
                
                matchState.viewers.forEach(viewer => {
                if (viewer.readyState === WebSocket.OPEN) viewer.send(JSON.stringify({ event: 'game:start' }));
                });

                //Starting game loop
                startGameLoop(match_id, matchState, activeMatches);
            }
            remaining--;
            }, 1000);
    }
}