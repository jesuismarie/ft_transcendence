import { createBall } from "./ball";
import { MatchPlayers, Score } from "../types";

export const matches = [
    { match_id: '123', player1_id: 'alice', player2_id: 'bob' },
    { match_id: '456', player1_id: 'charlie', player2_id: 'dave' },
];

export function getOrCreateMatch(match_id: string, store: Map<string, MatchPlayers>): MatchPlayers | undefined{
    if( !store.has(match_id) ){
        const leftPlayer = { x: 10, y: 250, width: 10, height: 100 };
        const rightPlayer = { x: 780, y: 250, width: 10, height: 100 };
        const score = { left: -1, right: 0, isGameStarted: false };

        const ball = createBall(640, 480, leftPlayer, rightPlayer, score, 10);

        store.set(match_id, {
            leftPlayer,
            rightPlayer,
            score,
            ball,
            viewers: new Set(),
        });
    }

    return store.get(match_id);
}

export function isPlayer(match_id: string, username: string) {
    const match = matches.find(m => m.match_id === match_id);
    return !!match && (match.player1_id === username || match.player2_id === username);
  }
  
export function isViewer(match_id: string, username: string) {
    const match = matches.find(m => m.match_id === match_id);
    return !!match && !(match.player1_id === username || match.player2_id === username);
}

export async function sendReportToServer(matchId: string, winner: 'left' | 'right', score: Score) {
    try {
      const response = await fetch('http://game-service:5001/report-match', { // TODO move to secrets
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer C8yJqmt8flJlPqTUy6ESf4EemfrSSGJPFa2GPnLmjas=', // TODO change using proxy service
        },
        body: JSON.stringify({
          match_id: matchId,
          winner,
          score,
          timestamp: new Date().toISOString()
        })
      });
  
      if (!response.ok) {
        console.error('Failed to send match report:', await response.text());
      } else {
        console.log('Match report successfully sent');
      }
    } catch (err) {
      console.error('Error sending report:', err);
    }
}