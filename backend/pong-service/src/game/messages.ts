import { WebSocket } from "ws";
import { MatchPlayers } from "../types";
import { matches } from "./state";

export function handlePlayerMessages(
    ws: WebSocket,
    matchState: MatchPlayers,
    username: string,
    match_id: string,
    message: any
  ){
    try {
        const { event, data } = JSON.parse(message.toString());

        const match = matches.find((m) => m.match_id === match_id);
        if(!match) return;
        
        const isLeft = username === match.player1_id

        switch (event) {
            case 'player:move':
            const player = isLeft ? matchState.leftPlayer : matchState.rightPlayer;
            player.x = data.x;
            player.y = data.y;

            const update = JSON.stringify({
                event: 'player:move',
                data: { playerId: isLeft ? 'left' : 'right', y: data.y },
            });

            if (isLeft) matchState.player2?.send(update);
            else matchState.player1?.send(update);
            break;
        }
    } catch (e) {
        console.error('Invalid WS message', e);
    }
  }