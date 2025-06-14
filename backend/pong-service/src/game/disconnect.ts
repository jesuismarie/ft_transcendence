import { WebSocket } from "ws";
import { MatchPlayers } from "../types";
import { sendReportToServer } from "./state";

export function handleDisconnection(
    ws: WebSocket,
    match_id: string,
    matchState: MatchPlayers,
    activeMatches: Map<string, MatchPlayers>,
    isViewer: boolean
){
    if(isViewer) return;

    const disconnectedRole = matchState.player1 === ws ? 'player1' : 'player2';
    
    matchState[disconnectedRole] = undefined;

    //If both players disconnected
    if(!matchState['player1'] && !matchState['player2']){

        const winner: 'left' | 'right' = matchState.score.left > matchState.score.right
            ? 'left'
            : matchState.score.right > matchState.score.left
            ? 'right'
            :  disconnectedRole === 'player1' ? 'left' : 'right';
        
        //Sending report to the server
        sendReportToServer(match_id, matchState, winner, matchState.score);

        console.log("Both are disconnected", matchState.viewers);
        
        matchState.viewers.forEach(viewer => {
            if (viewer.readyState === WebSocket.OPEN) viewer.send(JSON.stringify({
                event: 'game:finish',
                data: { message: `The ${winner} player wins!` },
            }));
        });

        activeMatches.delete(match_id);
    }
    
    

    if (matchState.gameLoop) {
        clearInterval(matchState.gameLoop);
        matchState.gameLoop = undefined;
    }
    
    // Notify the remaining player
    const remainingSocket = matchState.player1 || matchState.player2;
    
    
    remainingSocket?.send(JSON.stringify({
        event: 'game:pause',
        data: { message: 'Opponent disconnected. <br> Waiting 30s to resume...' },
    }));

    if(matchState.countdownTimeout){
        clearTimeout(matchState.countdownTimeout);
    }
    
    matchState.viewers.forEach(viewer => {
        if (viewer.readyState === WebSocket.OPEN) viewer.send(JSON.stringify({
            event: 'game:pause',
            data: { message: 'Opponent disconnected. <br> Waiting 30s to resume...' },
        }));
    });
    
    matchState.disconnectTimeout = setTimeout(() => {
        const stillDisconnected =
            (disconnectedRole === 'player1' && !matchState.player1) ||
            (disconnectedRole === 'player2' && !matchState.player2);
        
        if (stillDisconnected) {
            const winner = disconnectedRole === 'player1' ? 'right' : 'left';

            remainingSocket?.send(JSON.stringify({
                event: 'game:finish',
                data: { message: 'You win (opponent left)', win: true, draw: false },
            }));


            matchState.viewers.forEach(viewer => {
                if (viewer.readyState === WebSocket.OPEN) viewer.send(JSON.stringify({
                    event: 'game:finish',
                    data: { message: `The ${winner} player wins!` },
                }));
            });

            //Sending report to the server
            sendReportToServer(match_id, matchState, winner, matchState.score);

            activeMatches.delete(match_id);


        }
    }, 30000);
}
