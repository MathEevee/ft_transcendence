function loadSpaceInvadersGame(){
	
/*============================================VARAIBLES============================================*/

/*document*/
const canvas = document.getElementById('space-invadeur');
const context = canvas.getContext('2d');
const redButton = document.getElementById('redButton');

/*player*/

let lasshootplayer1 = 0;
let lasshootplayer2 = 0;

class Player
{
	constructor(x, y, width, height, dx, dy, speed, left, right, up, down, hitbox, life)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dx = dx;
		this.dy = dy;
		this.speed = speed;
		this.left = left;
		this.right = right;
		this.up = up;
		this.down = down;
		this.life = life;
		this.hitbox = hitbox;
	}
}

let start = 0;
let forcountdown = 1;

/*white, black, red, green, blue, yellow, pink, cyan*/
const colorpalette = ["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

const colorset =
{
	fontcolor: colorpalette[0],
	backgroundcolor: colorpalette[1],
	bulletcolor: colorpalette[2],
	player1color: colorpalette[3],
	player2color: colorpalette[4],
}

/*bullet*/

class Bullet
{
	constructor(x, y, width, height, dx, dy, speed, shoot, playersbullet, hitbox)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dx = dx;
		this.dy = dy;
		this.speed = speed;
		this.shoot = shoot;
		this.playersbullet = playersbullet;
		this.hitbox = hitbox;
	}
}

/*game*/

t_game = {
	player1: new Player(0, 0, 50, 50, 0, 0, 5, 37, 39, 3, [0, 0, 50, 50]),
	player2: new Player(0, 0, 50, 50, 0, 0, 5, 65, 68, 3, [0, 0, 50, 50]),
	bullets: [],
	colorset: colorset,
};

const modeleplayer1 = [
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
	[1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1],
	[1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1],
	[0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
	[0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
];

const modeleplayer2 = [
	[0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
	[0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
	[1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1],
	[1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1],
	[1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
	[0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
];

let bullets = [];

const modelebullet = [
	[0, 1, 0],
	[0, 1, 0],
	[0, 1, 0],
];

/*background*/

let star = [];

for (let i = 0; i < 100; i++)
{
	star.push([Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2 + 1]);
}

/*============================================FUNCTIONS============================================*/
/*============================================FUNCTIONS============================================*/
/*============================================FUNCTIONS============================================*/


// Fonction pour gérer le basculement en mode plein écran
function toggleFullscreen(element) {
	if (!document.fullscreenElement) {
		// Passer en plein écran
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) { // Pour Firefox
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) { // Pour Chrome, Safari et Opera
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) { // Pour Internet Explorer/Edge
			element.msRequestFullscreen();
		}
	} else {
		// Quitter le mode plein écran
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) { // Pour Firefox
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) { // Pour Chrome, Safari et Opera
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) { // Pour Internet Explorer/Edge
			document.msExitFullscreen();
		}
	}
}


/*============================================DRAWING============================================*/

/*draw functions for the game*/

function drawRect(x, y, width, height, color) {
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function drawbackgroundanimation()
{
	let i = 0;
	while (i < star.length)
	{
		drawRect(star[i][0], star[i][1], star[i][2], star[i][2], colorset.fontcolor);
		star[i][1] += 1;
		if (star[i][1] > canvas.height)
			star[i][1] = 0;
		i++;
	}
}

function cleartobackground(context, canvas)
{
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = colorset.backgroundcolor;
	drawRect(0, 0, canvas.width, canvas.height, colorset.backgroundcolor);
}

function drawlifeplayer(context, player, color, width, height, x, y)
{
	let i = 0;
	let length = 10;
	while (i < player.life)
	{
		drawRect(x + i * length, y, width, height, color);
		i++;
	}	
}

function drawplayer(canvas, context, x, y, modeleplayer, color, width, height, player)
{
	let i = 0;
	while (i < modeleplayer.length)
	{
		let j = 0;
		while (j < modeleplayer[i].length)
		{
			if (modeleplayer[i][j] === 1)
				drawRect(x + j * width, y + i * height, width, height, color);
			player.hitbox = [x, y, x + width * modeleplayer[0].length, y + height * modeleplayer.length];
			j++;
		}
		i++;
	}
}

function drawbullets(context, bullets, colorset)
{
	let i = 0;
	let j = 0;
	let k = 0;
	let width = 10;
	let height = 10;
	while (i < bullets.length)
	{
		context.fillStyle = colorset.bulletcolor;
		j = 0;
		while (j < modelebullet.length)
		{
			k = 0;
			while (k < modelebullet[j].length)
			{
				if (modelebullet[j][k] === 1)
					context.fillRect(bullets[i].x + k * width, bullets[i].y + j * height, width, height);
				bullets[i].hitbox = [bullets[i].x, bullets[i].y, bullets[i].x + width * modelebullet[0].length, bullets[i].y + height * modelebullet.length];
				k++;
			}
			j++;
		}
		i++;
	}
}

function draw(canvas, context, t_game)
{
	cleartobackground(context, canvas);
	drawbackgroundanimation();
	drawplayer(canvas, context, t_game.player1.x, t_game.player1.y, modeleplayer1, colorset.player1color, t_game.player1.width, t_game.player1.height , t_game.player1);
	drawlifeplayer(context, t_game.player1, colorset.player1color, 10, 10, t_game.player1.x - 5, t_game.player1.y - 20);
	drawplayer(canvas, context, t_game.player2.x, t_game.player2.y, modeleplayer2, colorset.player2color, t_game.player2.width, t_game.player2.height , t_game.player2);
	drawlifeplayer(context, t_game.player2, colorset.player2color, 10, 10, t_game.player2.x - 5, t_game.player2.y + 70);
	drawbullets(context, t_game.bullets, t_game.colorset);
}

/*============================================UPDATE============================================*/

function updateplayer(canvas, context, player1, player2)
{
	player1.x += player1.dx;
	player2.x += player2.dx;
	player1.x = Math.min(Math.max(player1.x, 0), canvas.width - player1.width * modeleplayer1[0].length);
	player2.x = Math.min(Math.max(player2.x, 0), canvas.width - player2.width * modeleplayer2[0].length);

	player1.y += player1.dy;
	player2.y += player2.dy;
	player1.y = Math.min(Math.max(player1.y, 50), canvas.height / 2 - 50);
	player2.y = Math.min(Math.max(player2.y, canvas.height / 2 + 50), canvas.height - 80);
}

function hitboxcollision(hitbox1, hitbox2)
{
	if (hitbox1 == 0 || hitbox1 === undefined || hitbox2 === undefined || hitbox2 === 0)
		return (false);
	const [x1, y1, x2, y2] = hitbox1;
	const [x3, y3, x4, y4] = hitbox2;
	if (x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3)
		return (true);
	return (false);
}

function prinsmg(context, text, x, y)
{
	cleartobackground(context, canvas);
	drawbackgroundanimation();
	context.fillStyle = colorset.fontcolor;
	context.font = "50px Arial";
	context.fillText(text, x, y);
}

function gamefinished(canvas, context, t_game)
{
	if (t_game.player1.life <= 0)
	{
		prinsmg(context, "Player 2 wins", canvas.width / 2 - 150, canvas.height / 2);
		setTimeout(wait, 2000);
		return (1);
	}
	else if (t_game.player2.life <= 0)
	{
		prinsmg(context, "Player 1 wins", canvas.width / 2 - 150, canvas.height / 2);
		setTimeout(wait, 2000);
		return (1);
	}
	return (0);
}

function updatebullets(canvas, context, t_game)
{
	let i = 0;

	while (i < t_game.bullets.length)
	{
		if (t_game.bullets[i].y < 50 || t_game.bullets[i].y > canvas.height - 70)
			t_game.bullets.splice(i, 1);
		else if (t_game.bullets[i].playersbullet === "player1" && hitboxcollision(t_game.bullets[i].hitbox, t_game.player2.hitbox))
		{
			t_game.player2.life--;
			t_game.bullets.splice(i, 1);
		}
		else if (t_game.bullets[i].playersbullet === "player2" && hitboxcollision(t_game.bullets[i].hitbox, t_game.player1.hitbox))
		{
			t_game.player1.life--;
			t_game.bullets.splice(i, 1);
		}
		else if (t_game.bullets[i].playersbullet === "player1")
		{
			t_game.bullets[i].y -= t_game.bullets[i].dy * t_game.bullets[i].speed;
			i++;
		}
		else if (t_game.bullets[i].playersbullet === "player2")
		{
			t_game.bullets[i].y -= t_game.bullets[i].dy * t_game.bullets[i].speed;
			i++;
		}
	}
}

function update()
{
	if (gamefinished(canvas, context, t_game))
		return (1);
	updateplayer(canvas, context, t_game.player1, t_game.player2);
	updatebullets(canvas, context, t_game);
	if (bullets.length > 0)
		updatebullets(bullets, canvas, context, aliens, score);
}

/*============================================GAME LOOP============================================*/
		
function gameloop()
{
	if (update(canvas, context, t_game))
	{
		start = 0;
		return (1);
	}
	draw(canvas, context, t_game);
	requestAnimationFrame(gameloop);
}
	
function countdown()
{
	let count = 3;
	forcountdown = 1;
	const interval = setInterval(() =>
	{
		cleartobackground(context, canvas);
		drawbackgroundanimation();
		context.fillStyle = colorset.fontcolor;
		context.font = "100px Arial";
		context.fillText(count, canvas.width / 2 - 25, canvas.height / 2 + 25);
		count--;
		if (count < 0)
		{
			clearInterval(interval);
			cleartobackground(context, canvas);
			context.fillText("GO!", canvas.width / 2 - 75, canvas.height / 2 + 25);
			forcountdown = 0;
		}
	}, 1000);
}

function initvariables()
{
	t_game = {
		player1: new Player(canvas.width / 2 - 10, 50, 5, 5, 0, 0, 7, 0, 0, 0, 0, [canvas.width / 2 - 10, canvas.height / 2 - 10, canvas.width / 2 + 10, canvas.height / 2 + 10], 6),
		player2: new Player(canvas.width / 2 - 10, canvas.height - 110, 5, 5, 0, 0, 7, 0, 0, 0, 0, [canvas.width / 2 - 10, canvas.height / 2 - 10, canvas.width / 2 + 10, canvas.height / 2 + 10], 6),
		bullets: [],
		colorset: colorset,
	};
	bullets = [];
}

function startGame()
{
	alert("HELLO")
	if (start === 1)
		return ;
	countdown();
	initvariables();
	start = 1;
	setTimeout(gameloop, 4000);
}

function wait()
{
	if (start === 1)
		return ;
	cleartobackground(context, canvas);
	drawbackgroundanimation();
	context.fillStyle = colorset.fontcolor;
	context.font = "50px Arial";
	context.fillText("Press the red button to start", canvas.width / 2 - 250, canvas.height / 2);
	requestAnimationFrame(wait);
}

wait();

/*============================================EVENT LISTENERS============================================*/

/*down*/
function keyhookdownforgame(event)
{
	if (start === 0 || forcountdown === 1)
		return ;
	const now = Date.now();
	if (event.key === "ArrowLeft" && t_game.player2.left === 0)
	{
		t_game.player2.dx -= 7;
		t_game.player2.left = 1;
	}
	else if (event.key === "ArrowRight" && t_game.player2.right === 0)
	{
		t_game.player2.dx += 7;
		t_game.player2.right = 1;
	}
	else if (event.key === "ArrowUp" && t_game.player2.up === 0)
	{
		t_game.player2.dy -= 7;
		t_game.player2.up = 1;
	}
	else if (event.key === "ArrowDown" && t_game.player2.down === 0)
	{
		t_game.player2.dy += 7;
		t_game.player2.down = 1;
	}
	else if ((event.key === "a" || event.key === "q") && t_game.player1.left === 0)
	{
		t_game.player1.dx -= 7;
		t_game.player1.left = 1;
	}
	else if (event.key === "d" && t_game.player1.right === 0)
	{
		t_game.player1.dx += 7;
		t_game.player1.right = 1;
	}
	else if ((event.key === "w" || event.key === "z") && t_game.player1.up === 0)
	{
		t_game.player1.dy -= 7;
		t_game.player1.up = 1;
	}
	else if (event.key === "s" && t_game.player1.down === 0)
	{
		t_game.player1.dy += 7;
		t_game.player1.down = 1;
	}
	if (event.key === "f")
	{
		if (now - lasshootplayer1 < 100)
			return ;
		lasshootplayer1 = now;
		t_game.bullets.push(new Bullet(t_game.player1.x - t_game.player1.width / 2 + (modelebullet.length / 2) * 10 , t_game.player1.y + t_game.player1.height, 10, 10, 0, -1, 20, 1, "player1", [t_game.player1.x + t_game.player1.width / 2, t_game.player1.y + t_game.player1.height, 10, 10]));
	}
	if (event.key === " ")
	{
		if (now - lasshootplayer2 < 100)
			return ;
		lasshootplayer2 = now;
		t_game.bullets.push(new Bullet(t_game.player2.x - t_game.player2.width / 2 + (modelebullet.length / 2) * 10, t_game.player2.y - t_game.player2.height, 10, 10, 0, 1, 20, 1, "player2", [t_game.player2.x + t_game.player2.width / 2, t_game.player2.y - t_game.player2.height, 10, 10]));
	}
}
					
document.addEventListener('keydown', function(event)
{
	if (start === 1 && forcountdown === 0)
		keyhookdownforgame(event);
});

/*up*/

function keyhookupforgame(event)
{
	if (start === 0 || forcountdown === 1)
		return ;
	if (event.key === "ArrowLeft" && t_game.player2.left === 1)
	{
		t_game.player2.dx += 7;
		t_game.player2.left = 0;
	}
	else if (event.key === "ArrowRight" && t_game.player2.right === 1)
	{
		t_game.player2.dx -= 7;
		t_game.player2.right = 0;
	}
	else if (event.key === "ArrowUp" && t_game.player2.up === 1)
	{
		t_game.player2.dy += 7;
		t_game.player2.up = 0;
	}
	else if (event.key === "ArrowDown" && t_game.player2.down === 1)
	{
		t_game.player2.dy -= 7;
		t_game.player2.down = 0;
	}
	else if ((event.key === "a" || event.key === "q") && t_game.player1.left === 1)
	{
		t_game.player1.dx += 7;
		t_game.player1.left = 0;
	}
	else if (event.key === "d" && t_game.player1.right === 1)
	{
		t_game.player1.dx -= 7;
		t_game.player1.right = 0;
	}
	else if ((event.key === "w" || event.key === "z") && t_game.player1.up === 1)
	{
		t_game.player1.dy += 7;
		t_game.player1.up = 0;
	}
	else if (event.key === "s" && t_game.player1.down === 1)
	{
		t_game.player1.dy -= 7;
		t_game.player1.down = 0;
	}

}

document.addEventListener('keyup', function(event)
{
	if (event.key === "r")
		startGame();
	else if (event.key === "o" || event.key === "O")
		toggleFullscreen(canvas);
	if (start === 1 && forcountdown === 0)
		keyhookupforgame(event);
});

redButton.addEventListener('click', startGame);
		
}