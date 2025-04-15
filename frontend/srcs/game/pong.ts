const canvas = document.getElementById('pongCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

const ASPECT_RATIO = 16 / 9;

let ballRadius: number;
let paddleWidth: number;
let paddleHeight: number;
let paddleSpeed: number;

function setupCanvas() {
	if (window.innerWidth / window.innerHeight > ASPECT_RATIO) {
		canvas.height = Math.min(window.innerHeight * 0.8, 700);
		canvas.width = canvas.height * ASPECT_RATIO;
	}
	else {
		canvas.width = Math.min(window.innerWidth * 0.8, 1000);
		canvas.height = canvas.width / ASPECT_RATIO;
	}

	ballRadius = canvas.width * 0.01;
	paddleWidth = canvas.width * 0.015;
	paddleHeight = canvas.height * 0.15;
	paddleSpeed = canvas.height * 0.02;
		
	resetBall();
	resetPaddles();
}

function resetPaddles() {
	leftPaddleY = (canvas.height - paddleHeight) / 2;
	rightPaddleY = (canvas.height - paddleHeight) / 2;
}

let ballX: number;
let ballY: number;
let ballSpeedX: number;
let ballSpeedY: number;
let leftPaddleY: number;
let rightPaddleY: number;

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

function resetBall() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;

	ballSpeedX = canvas.width * 0.005;
	ballSpeedY = canvas.height * 0.005;

	ballSpeedX *= Math.random() > 0.5 ? 1 : -1;
	ballSpeedY *= Math.random() > 0.5 ? 1 : -1;
}

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

	if (ballX - ballRadius < paddleWidth && 
		ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX * 1.05;

		const hitPosition = (ballY - (leftPaddleY + paddleHeight/2)) / (paddleHeight/2);
		ballSpeedY = hitPosition * Math.abs(ballSpeedX);
	}
		
	if (ballX + ballRadius > canvas.width - paddleWidth && 
		ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
		ballSpeedX = -ballSpeedX * 1.05;
		const hitPosition = (ballY - (rightPaddleY + paddleHeight/2)) / (paddleHeight/2);
		ballSpeedY = hitPosition * Math.abs(ballSpeedX);
	}

	if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
		resetBall();
		resetPaddles();
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

function drawCenterLine() {
	ctx.strokeStyle = '#fff';
	ctx.setLineDash([canvas.height * 0.02, canvas.height * 0.02]);
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
	ctx.setLineDash([]);
}

function draw() {
	clearCanvas();
	drawCenterLine();
	drawPaddles();
	drawBall();
}

function gameLoop() {
	update();
	draw();
	requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', () => {
	if (!gameRunning) {
		gameRunning = true;
		gameLoop();
	}
});

let gameRunning = false;
setupCanvas();
draw();

// function handleResize() {
// 	setupCanvas();
// 	draw();
// }

// window.addEventListener('resize', handleResize);
// window.addEventListener('orientationchange', handleResize);