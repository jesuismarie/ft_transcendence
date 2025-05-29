import type { CanvasPongContext, Score } from "../types";

export const score = (gameCanvas: CanvasPongContext): Score => ({
    left: 0,
    right: 0,
    draw: function(){
        const ctx = gameCanvas.getContext();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px Kode Mono";

        const leftScoreWidth = ctx.measureText(this.left.toString()).width;
        const rightScoreWidth = ctx.measureText(this.right.toString()).width;
        ctx.fillText(this.left.toString(), ((gameCanvas.getWidth() / 2) - leftScoreWidth) / 2, 80);
        ctx.fillText(this.right.toString(),  gameCanvas.getWidth() - ( ((gameCanvas.getWidth() / 2) - rightScoreWidth) / 2 ) , 80);
        ctx.restore();
    }
})