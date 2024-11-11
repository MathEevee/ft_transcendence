const canvas = document.getElementById('space-invadeur');
const context = canvas.getContext('2d');

const player = { x: context.canvas.width / 2 - 50 , y: context.canvas.height - 10, width: 100, height: 15, dx: 0, dy: 0, speed: 2, left: 0, right: 0, life: 3};

const bullet = { x: player.x, y: player.y, width: 10, height: 10, dx: 1, dy: 1, speed: 10, shoot: 0};

const invader = { x: canvas.width / 2 - 50, y: canvas.height * 0.1, width: 20, height: 20, dx: 1, dy: 1, speed: 1};

let start = 0;

function drawTriangle(x, y, width, height)
{
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + width / 2, y - height);
	context.lineTo(x + width, y);
	context.fill();
}

function drawheart(x, y, width, height)
{
	context.beginPath();
	context.moveTo(x, y);
	context.lineTo(x + width / 2, y - height);
	context.lineTo(x + width, y);
	context.fill();
}

function drawPlayerLife()
{
	context.fillStyle = "white";
	context.font = "25px Arial";
	context.fillText("Life : ", 10, 20);
	context.fillStyle = "red";
	for (let i = 0; i < player.life; i++)
		drawheart(80 + i * 30, 15, 10, 10);
}

function drawPlayer()
{
	context.fillStyle = "white";
	drawTriangle(player.x, player.y, player.width, player.height);
	drawPlayerLife();
}

function drawBullet()
{
	context.fillStyle = "white";
	context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function drawInvader()
{
	context.fillStyle = "green";
	context.fillRect(invader.x, invader.y, invader.width, invader.height);
}

function drawtopline()
{
	context.fillStyle = "white";
	context.fillRect(0, canvas.height * 0.05 , canvas.width, 5);
}

function draw()
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawtopline();
	drawInvader();
	drawPlayer();
	if (bullet.shoot === 1)
		drawBullet();
}

function updatePlayer()
{
	player.x += player.dx * player.speed;
	player.x = Math.min(Math.max(player.x, 0), canvas.width - player.width);
}

function updateBullet()
{
	bullet.y -= bullet.speed;
}

function update()
{
	updatePlayer();
	while (bullet.y < 0 || bullet.y > canvas.height )
		updateBullet();
}

function gameloop()
{
	update();
	draw();
	requestAnimationFrame(gameloop);
}

function shootbullet()
{
	bullet.shoot = 1;
}

document.addEventListener('keydown', function(event) {
	if ((event.key === "ArrowLeft") && player.left !== 1)
	{
		player.left = 1;
		player.dx += -player.speed;
	}
	else if ((event.key === "ArrowRight") && player.right !== 1)
	{
		player.right = 1;
		player.dx += player.speed;
	}
	else if (event.key === "q" && player.shootangle > -Math.PI / 2)
	{
		player.shootangle -= Math.PI / 180;
	}
	else if (event.key === "d" && player.shootangle < Math.PI / 2)
		player.shootangle += Math.PI / 180;
	else if (event.key === "t")
		shootbullet();
});

document.addEventListener('keyup', function(event) {
	if (event.key === "ArrowLeft" && player.left === 1)
	{
		player.left = 0;
		player.dx -= -player.speed;
	}
	else if (event.key === "ArrowRight" && player.right === 1)
	{
		player.right = 0;
		player.dx -= player.speed;
	}
	else if (event.key === "q" && player.shootangle < 0)
	{
		player.shootangle += Math.PI / 180;
	}
	else if (event.key === "d" && player.shootangle > 0)
		player.shootangle -= Math.PI / 180;
});

function countdown()
{
	context.fillStyle = "white";
	context.font = "30px Arial";
	context.fillText("3", canvas.width / 2 - 10, canvas.height / 2);
	setTimeout(function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText("2", canvas.width / 2 - 10, canvas.height / 2);
	}, 1000);
	setTimeout(function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText("1", canvas.width / 2 - 10, canvas.height / 2);
	}, 2000);
	setTimeout(function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText("GO", canvas.width / 2 - 20, canvas.height / 2);
	}, 3000);
}

function startGame()
{
	// countdown();
	// setTimeout(gameloop, 3000);
	if (start === 1)
		return ;
	start = 1;
	gameloop();
}