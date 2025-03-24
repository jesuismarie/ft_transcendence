const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

canvas.width = 1000;
canvas.height = 700;

const ballRadius = 10;

const paddleWidth = 15;
const paddleHeight = 100;
const paddleSpeed = 8;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;

type Keys = {
	w: boolean;
	s: boolean;
	ArrowUp: boolean;
	ArrowDown: boolean;
};

const keys: Keys = {
	w: false,
	s: false,
	ArrowUp: false,
	ArrowDown: false,
};

document.addEventListener('keydown', (e: KeyboardEvent) => {
	if (e.key in keys) {
		keys[e.key as keyof Keys] = true;
	}
});

document.addEventListener('keyup', (e: KeyboardEvent) => {
	if (e.key in keys) {
		keys[e.key as keyof Keys] = false;
	}
});

function resetBall() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballSpeedX = -ballSpeedX;
}

function update() {
	if (keys.w && leftPaddleY > 0) {
		leftPaddleY -= paddleSpeed;
	}
	if (keys.s && leftPaddleY < canvas.height - paddleHeight) {
		leftPaddleY += paddleSpeed;
	}

	if (keys.ArrowUp && rightPaddleY > 0) {
		rightPaddleY -= paddleSpeed;
	}
	if (keys.ArrowDown && rightPaddleY < canvas.height - paddleHeight) {
		rightPaddleY += paddleSpeed;
	}

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

	if (ballX - ballRadius < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	}
	if (ballX + ballRadius > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX;
	}

	if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
		resetBall();
	}
}

function clearCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPaddles() {
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
	ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = '#fff';
	ctx.fill();
	ctx.closePath();
}

function draw() {
	clearCanvas();
	drawBall();
	drawPaddles();
}

function gameLoop() {
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
	if (e.key == 'Enter') {
		gameLoop();
	}
})

drawPaddles();
drawBall();