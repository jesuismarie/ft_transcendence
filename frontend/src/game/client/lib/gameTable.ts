import type { CanvasPongContext, GameTableModel } from "../types";

export const gameTable = (gameCanvas: CanvasPongContext,lineWidth: number, gap: number): GameTableModel => ({
    draw: function(){
        const ctx = gameCanvas.getContext();
        var y = 0;
        while(y < gameCanvas.getHeight()){
            ctx.fillRect( (gameCanvas.getWidth() - lineWidth) / 2, y + gap, lineWidth, gap / 2 );
            y += gap;
        }
    
        ctx.restore();
    }
})