export type Score = {
    left: number,
    right: number,
    draw(): void
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
    getKeyState(): KeyState,
    setMessage(message: string): void,
    clearMessage(): void
}

export type PlayerModel = {
    x: number,
    y: number,
    width: number,
    height: number,
    backgroundColor: string,
    update(): void,
    draw(): void
}

export type BallModel = {
    x: number,
    y: number,
    radius: number,
    backgroundColor: string,
    speed: number,
    velocity: { x: number, y: number },
    update(): void,
    draw(): void,
    serve(side: number): void
}

export type GameTableModel = {
    draw(): void,
}