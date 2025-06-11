import { WebSocket } from "ws"
import { createBall } from "./game/ball"

export type Match = {
    match_id: string,
    player1_id: string,
    player2_id: string,
}

export type Score = {
    left: number,
    right: number,
    isGameStarted: boolean
}

export type PlayerKeys = {
    up: string,
    down: string
}

export type PlayerModel = {
    x: number,
    y: number,
    width: number,
    height: number
}

export type BallModel = {
    x: number,
    y: number,
    radius: number,
    backgroundColor: string,
    speed: number,
    velocity: { x: number, y: number },
    update(): void,
    hasWinner(): null | 'left' | 'right',
    serve(side: number): void
}

export type MatchPlayers = {
    player1?: WebSocket;
    player2?: WebSocket;
    player1Username?: string;
    player2Username?: string;
    gameLoop?: NodeJS.Timeout;
    disconnectTimeout?: NodeJS.Timeout;
    countdownTimeout?: NodeJS.Timeout;
    ball: ReturnType<typeof createBall>;
    score: Score;
    leftPlayer: PlayerModel;
    rightPlayer: PlayerModel;
    viewers: Set<WebSocket>; 
  };