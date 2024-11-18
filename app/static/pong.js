function loadPong(){
	const canvas = document.getElementById('pong');
	const context = canvas.getContext('2d');
	const redbutton = document.getElementById('red');


// Joueurs
const paddleWidth = 10;
const paddleHeight = 100;
const player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0, ismoving: false};
const player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 , ismoving: false};

// Balle
const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 5, dx: 1, dy: Math.random() - 0.5 };

//score
let score1 = 0;
let score2 = 0;

let speed = 7;

let start = 0;


/* Dessin */

function drawRect(x, y, width, height, color) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2);
	context.closePath();
	context.fill();
}
  
function drawNet() {
	for (let i = 0; i < canvas.height; i += 15) {
		drawRect(canvas.width / 2 - 1, i, 2, 10, "#FFF");
	}
}

function drawScore() {
	context.fillStyle = "#FFF";
	context.font = "35px Arial";
	context.fillText(score1, canvas.width / 4, 50);
	context.fillText(score2, 3 * canvas.width / 4, 50);
}
  
function draw() {
	drawRect(0, 0, canvas.width, canvas.height, "#000"); // Fond
	drawNet();
	drawRect(player1.x, player1.y, player1.width, player1.height, "#FFF"); // Raquette joueur 1
	drawRect(player2.x, player2.y, player2.width, player2.height, "#FFF"); // Raquette joueur 2
	drawCircle(ball.x, ball.y, ball.radius, "#FFF"); // Balle
	drawScore();
}

/* Mouvement des raquettes */

document.addEventListener("keydown", (event) =>
{
	if (event.key === "ArrowUp" && player2.up !== 1)
	{
		player2.up = 1;
		player2.dy += -speed;
	}
	else if (event.key === "ArrowDown" && player2.down !== 1)
	{
		player2.down = 1;
		player2.dy += speed;
	}
	else if (event.key === "z" && player1.up !== 1)
	{
		player1.up = 1;
		player1.dy += -speed;
	}
	else if (event.key === "s" && player1.down !== 1)
	{
		player1.down = 1;
		player1.dy += speed;
	}
});

document.addEventListener("keyup", (event) =>
{
	if (event.key === "ArrowUp" && player2.up === 1)
	{
		player2.up = 0;
		player2.dy -= -speed;
	}
	else if (event.key === "ArrowDown" && player2.down === 1)
	{
		player2.down = 0;
		player2.dy -= speed;
	}
	else if (event.key === "z" && player1.up === 1)
	{
		player1.up = 0;
		player1.dy -= -speed;
	}
	else if (event.key === "s" && player1.down === 1)
	{
		player1.down = 0;
		player1.dy -= speed;
	}
});

function playerMove()
{
	player1.y += player1.dy;

	player1.y = Math.max(Math.min(player1.y, canvas.height - paddleHeight), 0);
}

function ballMove()
{
	ball.y += ball.dy * ball.speed;
	ball.x += ball.dx * ball.speed;
}

function ballCollision()
{
	if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
		ball.dy *= -1;
	if (ball.x - ball.radius < player1.x + player1.width && ball.y > player1.y && ball.y < player1.y + player1.height)
	{
		ball.dx *= -1;
		ball.dy = (ball.y - (player1.y + player1.height / 2)) / player1.height / 2;
		ball.speed += 1;
		ball.x = player1.x + player1.width + ball.radius;
	}
	else if (ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + player2.height)
	{
		ball.dx *= -1;
		ball.dy = (ball.y - (player2.y + player2.height / 2)) / player2.height / 2;
		ball.speed += 1;
		ball.x = player2.x - player2.width - ball.radius;
	}
}

function increaseScore()
{
	if (ball.x < 0)
		score2++;
	else
	score1++;
	if (score1 === 5 || score2 === 5)
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText(score1 === 5 ? "Player 1 wins!" : "Player 2 wins!", canvas.width / 2 - 100, canvas.height / 2 + 25);
		start = 0;
		return 1;
	}
}

function ballPoint()
{
	if (ball.x < 0 || ball.x > canvas.width)
	{
		if (increaseScore())
			return 1;
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.speed = 5;
		ball.dx *= 1;
		ball.dy = Math.random() - 0.5;
		player1.y = canvas.height / 2 - paddleHeight / 2;
		player2.y = canvas.height / 2 - paddleHeight / 2;
	}
}

/* Jeu */
function update()
{
	playerMove();
	ballMove();
	ballCollision()
	if (ballPoint())
		return 1;
}

/* Fonctions utilitaires */

function countdown()
{
	let count = 3;
	const interval = setInterval(() => {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = "#FFF";
		context.font = "100px Arial";
		context.fillText(count, canvas.width / 2 - 25, canvas.height / 2 + 25);
		count--;
		if (count < 0)
		{
			clearInterval(interval);
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillText("GO!", canvas.width / 2 - 75, canvas.height / 2 + 25);
		}
	}, 1000);
}

function loop()
{
	if (update())
		return 1;
	draw();
	requestAnimationFrame(loop);
}

function startGame()
{
	console.log("Game started");
	if (start === 1)
		return ;
	start = 1;
	countdown();
	setTimeout(loop, 5000);
}

function wait()
{
	context.fillStyle = "#FFF";
	context.font = "50px Arial";
	context.fillText("Press red button to start", canvas.width / 2 - 250, canvas.height / 2);
}

wait();
redbutton.addEventListener("click", startGame);
}