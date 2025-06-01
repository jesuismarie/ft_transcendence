import type { BallModel, CanvasPongContext, PlayerModel, Score } from "../types";

export const Ball = (gameCanvas: CanvasPongContext, leftPlayer: PlayerModel, rightPlayer: PlayerModel, score: Score): BallModel => ({
    x: (gameCanvas.getWidth() - 20) / 2,
    y: (gameCanvas.getHeight() - 20) / 2,
    radius: 5,
    backgroundColor: "#FFFFFF",
    speed: 6,
    velocity: {x: 5, y: 0},
    serve: function(side: number){
        var random = Math.random();

        if( side > 0 ){
            score.left++;
        }else {
            score.right++;
        }

        this.x = (gameCanvas.getWidth() - 20) / 2;
        this.y = ( gameCanvas.getHeight() - this.radius ) * random;

        var phi = 0.1 * Math.PI * ( 1 - 2 * random );
        this.velocity = {
            x : side * this.speed * Math.cos(phi),
            y : this.speed * Math.sin(phi)
        }
    },
    update: function(){
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if( 0 > this.y || this.y + this.radius > gameCanvas.getHeight() ){
            var offset = this.velocity.y < 0 ? 0 - this.y : gameCanvas.getHeight() - (this.y+this.radius);
            this.y +=2*offset;
            this.velocity.y *= -1;
        }

        // Axis-Aligned Bounding Box collision detection

        var AABBIntersect = function(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number){
            return ax < bx+bw && ay < by + bh && bx < ax + aw && by < ay+ah;
        }

        var paddle = this.velocity.x < 0 ? leftPlayer : rightPlayer;

        if(AABBIntersect(paddle.x, paddle.y, paddle.width, paddle.height, this.x, this.y, this.radius, this.radius )){
            this.x = paddle === leftPlayer ? leftPlayer.x + leftPlayer.width : rightPlayer.x - this.radius;
            var n = (this.y + this.radius - paddle.y) / ( paddle.height + this.radius );
            var phi = 0.25 * Math.PI * ( 2 * n - 1 );
            

            var smash = Math.abs(phi) > 0.2 * Math.PI ? 1.5 : 1;
            
            this.velocity.x = smash * (paddle === leftPlayer ? 1 : -1) * this.speed*Math.cos(phi);
            this.velocity.y = smash * this.speed * Math.sin(phi);
        }

        if( 0 > this.x+this.radius || this.x > gameCanvas.getWidth() ){
            this.serve(paddle === leftPlayer ? -1 : 1);
        }
    },
    draw: function(){
        const ctx = gameCanvas.getContext();
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.x, this.y, this.radius, this.radius)
        ctx.restore();
    }
})