import { createBall } from "./ball";
import { MatchPlayers, Score, Match } from "../types";
import axios, {AxiosInstance } from "axios";

export const matches = new Array<Match>();

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

export async function sendReportToServer(matchId: string, matchState: MatchPlayers, winnerPositon: 'left' | 'right', score: Score) {

    if( !matchState.player1Username || !matchState.player2Username ) return;

    const result: {
      match_id: number,
      winner: number,
      score: {
        winner_score: number,
        looser_score: number
      }
    } = {
      match_id: parseInt(matchId),
      winner: winnerPositon == 'left' ? parseInt(matchState.player1Username) :  parseInt(matchState.player2Username),
      score: {
        winner_score : winnerPositon == 'left' ? score.left : score.right,
        looser_score : winnerPositon == 'left' ? score.right : score.left
      }
    }


    try {
        const axiosClient: AxiosInstance = axios.create({
            baseURL: process.env.GAME_SERVICE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
      const response = await axiosClient.post('save-match-result', result);
  
      if (!(response.status >= 200 && response.status < 400)) {
        console.error('Failed to send match report');
      } else {
        console.log('Match report successfully sent');
      }
    } catch (err) {
      console.error('Error sending report:', err);
    }
}