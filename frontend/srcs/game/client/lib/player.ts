import { CanvasPongContext, PlayerKeys, PlayerModel } from "../types";

export const PlayerFactory = (
    gameCanvas: CanvasPongContext,
    x: number,
    keys: PlayerKeys
): PlayerModel => ({
    x,
    y: ( gameCanvas.getHeight() - 100 ) / 2,
    width: 8,
    height: 80,
    backgroundColor: "#FFFFFF",
    update: function(){},
    draw: function(){
        const ctx = gameCanvas.getContext();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.restore();
    }
})