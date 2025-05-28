import { MatchPlayers } from "../types";
import { sendReportToServer } from "./state";

export function startGameLoop(match_id: string, matchState: MatchPlayers, activeMatches: Map<string, MatchPlayers>){
    
    if( matchState.gameLoop ) {
        clearInterval(matchState.gameLoop);
        matchState.gameLoop = undefined;
    }
    
    matchState.gameLoop = setInterval(() => {
    const { ball, leftPlayer, rightPlayer, score } = matchState;
    ball.update();

    const hasWinner = ball.hasWinner();
    if (hasWinner) {
        clearInterval(matchState.gameLoop);
        matchState.gameLoop = undefined;
        matchState.score.isGameStarted = false;
        //Sending to player 1
        matchState.player1?.send(JSON.stringify({
            event: 'game:finish',
            data: {
              message: hasWinner === 'left' ? 'You win' : 'You lost',
              win: hasWinner === 'left',
              draw: false,
            },
        }));    
         //Sending to player 2
        matchState.player2?.send(JSON.stringify({
            event: 'game:finish',
            data: {
              message: hasWinner === 'right' ? 'You win' : 'You lost',
              win: hasWinner === 'right',
              draw: false,
            },
        }));

        matchState.viewers.forEach(viewer => {
            if (viewer.readyState === WebSocket.OPEN) viewer.send(JSON.stringify({
                event: 'game:finish',
                data: { message: `The ${hasWinner} player wins!` },
            }));
        });

        //Sending game final state to the external api
        sendReportToServer(match_id, hasWinner, score);

        activeMatches.delete(match_id);
        return;
    } 

    const payload = JSON.stringify({
        event: 'game:state',
        data: {
        ballS: { x: ball.x, y: ball.y, velocity: ball.velocity },
        playersS: {
            left: { y: leftPlayer.y },
            right: { y: rightPlayer.y },
        },
        scoreS: score,
        },
    });

    matchState.player1?.send(payload);
    matchState.player2?.send(payload);
    // Send to viewers
    matchState.viewers.forEach((viewer) => {
        if (viewer.readyState === WebSocket.OPEN) {
            viewer.send(payload);
        }
    });

    }, 1000 / 60);
}
