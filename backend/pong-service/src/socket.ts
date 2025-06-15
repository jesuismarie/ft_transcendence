import { WebSocket } from "ws";
import { IncomingMessage } from 'http';
import { MatchPlayers } from "./types";
import { getOrCreateMatch, isPlayer, isViewer } from "./game/state";
import { handlePlayer, handleViewer } from "./game/connection";
import { handleDisconnection } from "./game/disconnect";
import { handlePlayerMessages } from "./game/messages";

const activeMatches = new Map<string, MatchPlayers>();

export function handleSocketConnection(ws: WebSocket, req: IncomingMessage){
    try {
        const url = new URL(req.url!, `https://${req.headers.host}`);
        const segments = url.pathname.split('/');
        if (segments.length < 3) {
            (ws as any).isRejected = true;
            ws.send(JSON.stringify({ event: 'error', data: {message: 'Invalid connection URL' }}));
            ws.close();
            return;
        }

        const match_id = segments[1];
        const username = segments[2];

        const matchState = getOrCreateMatch(match_id, activeMatches);
        if(!matchState) return;

        if(isViewer(match_id, username)){
            handleViewer(ws, matchState);
        }else if( isPlayer(match_id, username) ) {
            handlePlayer(ws, matchState, match_id, username, activeMatches);
        }
        
        ws.on('message', (message) => {
            handlePlayerMessages(ws, matchState, username, match_id, message);
        })

         // Attach disconnection handler
         ws.on('close', () => {
            //Avoid disconnection logic on rejection
            if ((ws as any).isRejected) return;

            handleDisconnection(ws, match_id, matchState, activeMatches, isViewer(match_id, username));
        });
    }catch(err){
        console.error("Socket connection error:", err);
        (ws as any).isRejected = true;
        ws.send(JSON.stringify({ event: 'error', data: {message: "Socket connection error:"  }}));
        ws.close();
        
    }
}