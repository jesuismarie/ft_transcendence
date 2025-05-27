// server/Ball.ts
import { BallModel, PlayerModel, Score } from "./types"; // Same types as your frontend

export const createBall = (canvasWidth: number, canvasHeight: number, leftPlayer: PlayerModel, rightPlayer: PlayerModel, score: Score, scoreLimit: number): BallModel => ({
    x: (canvasWidth - 20) / 2,
    y: (canvasHeight - 20) / 2,
    radius: 5,
    backgroundColor: "#FFFFFF",
    speed: 4,
    velocity: { x: 5, y: 0 },
    serve(side: number) {
        const random = Math.random();
        

        if (side > 0) {
            score.left++;
        } else {
            score.right++;
        }

        this.x = (canvasWidth - 20) / 2;
        this.y = (canvasHeight - this.radius) * random;

        const phi = 0.1 * Math.PI * (1 - 2 * random);
        this.velocity = {
            x: side * this.speed * Math.cos(phi),
            y: this.speed * Math.sin(phi),
        };
    },
    hasWinner(){
        return score.left >= scoreLimit ? 'left' : ( score.right >= scoreLimit ? 'right' : null );
    },
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        

        if (this.y < 0 || this.y + this.radius > canvasHeight) {
            const offset = this.velocity.y < 0 ? -this.y : canvasHeight - (this.y + this.radius);
            this.y += 2 * offset;
            this.velocity.y *= -1;
        }

        var AABBIntersect = function(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number){
            return ax < bx+bw && ay < by + bh && bx < ax + aw && by < ay+ah;
        }

        const paddle = this.velocity.x < 0 ? leftPlayer : rightPlayer;        
        

        if (AABBIntersect(paddle.x, paddle.y, paddle.width, paddle.height, this.x, this.y, this.radius, this.radius)) {
            this.x = paddle === leftPlayer ? leftPlayer.x + paddle.width : rightPlayer.x - this.radius;

            const n = (this.y + this.radius - paddle.y) / (paddle.height + this.radius);
            const phi = 0.25 * Math.PI * (2 * n - 1);
            const smash = Math.abs(phi) > 0.2 * Math.PI ? 1.5 : 1;

            this.velocity.x = smash * (paddle === leftPlayer ? 1 : -1) * this.speed * Math.cos(phi);
            this.velocity.y = smash * this.speed * Math.sin(phi);
        }

        if (this.x + this.radius < 0 || this.x > canvasWidth) {
            this.serve(paddle === leftPlayer ? -1 : 1);
        }
    }
});
