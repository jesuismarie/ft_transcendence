export type Score = {
    left: number,
    right: number,
    isGameStarted: boolean
}

export type PlayerKeys = {
    up: string,
    down: string
}

export type KeyState = {
    [key:string]: boolean
}

export type CanvasPongContext = {
    onEvent(): void,
    getWidth(): number,
    getHeight(): number,
    getContext(): CanvasRenderingContext2D,
    getKeyState(): KeyState
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

export type GameTableModel = {
    draw(): void,
}