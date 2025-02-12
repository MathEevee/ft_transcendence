import { allconversations } from "/static/js/chatbox.js";
import { joinagame } from "/static/js/chatbox.js";
import { setjoinagame } from "/static/js/chatbox.js";

function loadSpaceInvadersGame(){
	
/*============================================VARAIBLES============================================*/

/*document*/
const canvas = document.getElementById('space-invadeur');
const context = canvas.getContext('2d');
const redButton = document.getElementById('redButton');
const chatbox = document.getElementById('box');
const inviteinput = document.getElementById('invite');
const divofbox = document.getElementById('game-info-player');
const redbutton = document.getElementById('redButton');
chatbox.style.display = "none";

/*socket*/
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsURL = `${wsProtocol}//${window.location.host}/ws/chat/`;
const socket = new WebSocket(wsURL);
let gamesocket;
let bebousocket;
let spacetournamentsocket;

/*player*/

let lasshootplayer1 = 0;
let lasshootplayer2 = 0;

let is_host = true;
let beplayer;

/*ia*/
let isdoubleia = 0;
let iaisactive = 0;

/*Game*/
let gamemode;
let gameId = null;
let interval;
let gameName = "SpaceBattle";

/*tournament*/
let tournament_id;

if (document.location.pathname === "/games/spaceinvaders/online/tournament/")
{
	readybutton = document.getElementById("ready-btn");
	tournament_id = document.getElementById("tournament-id").textContent;
	spacetournamentsocket = new WebSocket(`${wsProtocol}//${window.location.host}/ws/games/spaceinvaders/tournament/${tournament_id}/`);
	gamemode = "online_tournament";
}
else if (document.location.pathname === "/games/spaceinvaders/")
	gamemode = "online";

/*============================================INITIALIZATION============================================*/

async function getUserName() {
	const response = await fetch('/authe/api/me/');
	const data = await response.json();
	return data.username;
}

function putplayerinmatch(player1, player2)
{
	const currentmatch = document.getElementsByClassName("tournament-player");
	const player1name = document.createElement("h3");
	const player2name = document.createElement("h3");
	const playscore = document.createElement("p");
	const playscore2 = document.createElement("p");

	// delete allcurrentmatch;
	for (let i = 0; i < currentmatch.length; i++)
	{
		while (currentmatch[i].firstChild)
			currentmatch[i].removeChild(currentmatch[i].firstChild);
	}

	player1name.textContent = player1;
	playscore.textContent = "0";
	currentmatch[0].appendChild(player1name);
	currentmatch[0].appendChild(playscore);

	player2name.textContent = player2;
	playscore2.textContent = "0";
	currentmatch[1].appendChild(player2name);
	currentmatch[1].appendChild(playscore2);
}

async function startMatch(match)
{
	const matchlist = document.getElementById("match-list");
	const player1 = match.player1;
	const player2 = match.player2;

	if (player1 === undefined || player2 === undefined)
		return ;

	matchlist.removeChild(matchlist.firstChild);
	putplayerinmatch(player1, player2);
	if (player1 === await getUserName())
	{
	}
}

function putMatchList(match)
{
	const matchlist = document.getElementById("match-list");
	const matchli = document.createElement("li");
	const span = document.createElement("span");

	span.textContent = `${match.player1} vs ${match.player2}`;
	matchli.appendChild(span);
	matchlist.appendChild(matchli);
}

async function displayTournamentGame()
{
	const response = await fetch('/authe/api/tournaments/');
	const data = await response.json();
	let tournament;
	
	for (let i = 0; i < data.length; i++)
	{
		if (data[i].type_pong === false)
		{
			tournament = data[i];
			break;
		}
	}

	if (tournament === undefined)
		return ;

	for (let i = 0; i < tournament.match_entries.length; i++)
		putMatchList(tournament.match_entries[i]);

	await startMatch(tournament.match_entries[0]);
	tournament.match_entries.pop();
}

if (document.location.pathname === "/games/spaceinvaders/online/tournament/")
{
	document.getElementById("redButton").style.display = "none";
	document.getElementById("redButton").disabled = true;
	document.getElementById("tournamentbox").style.display = "block";
	inviteinput.style.display = "none";
	displayTournamentGame();
}
else if (document.location.pathname === "/games/spaceinvaders/")
{
	gamemode = "online";
}

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

	static copy(bullet)
	{
		return new Bullet(bullet.x, bullet.y, bullet.width, bullet.height, bullet.dx, bullet.dy, bullet.speed, bullet.shoot, bullet.playersbullet, bullet.hitbox);
	}
}

/*game*/

var t_game = {
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

function sizeofstringdisplayed(string)
{
	return (context.measureText(string));
}

// Fonction pour gérer le basculement en mode plein écran
function toggleFullscreen(element) {
	if (start === 0)
		return ;
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

/*============================================CHECK FUNCTION============================================*/

function isIA(player)
{
	if (player.includes("AI"))
		return true;
	return false;
}

async function checkPlayer(playername)
{
	if (playername === await getUserName())
		return false;
	const response = await fetch('/authe/api/users/');
	const data = await response.json();
	for (let i = 0; i < data.length; i++)
	{
		if (data[i].username === playername)
			return true;
	}
	return false;
}

/*============================================DRAWING============================================*/

/*draw functions for the game*/

function putnameinbox(name)
{
	if (divofbox.childElementCount >= 2)
		return ;
	const playernamebox = document.createElement('h1');
	playernamebox.setAttribute('id', 'playername');
	playernamebox.textContent = name;
	playernamebox.style.display = "flex";
	divofbox.appendChild(playernamebox);
	if (divofbox.childElementCount >= 2)
			inviteinput.style.display = "none";
}

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
	if (bebousocket)
		return (0);
	else
	{
		if (gamesocket && t_game.player1.life <= 0 || t_game.player2.life <= 0) 
		{
			console.log('end');
			gamesocket.send(JSON.stringify({
				'message': 'end',
			}));
		}
	}
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
			setTimeout(() => {
				if (gamesocket)
				{
					gamesocket.send(JSON.stringify({
						'message': 'touch',
						'player': 'player2',
						'life': t_game.player2.life,
					}));
				}
			}, 100);
		}
		else if (t_game.bullets[i].playersbullet === "player2" && hitboxcollision(t_game.bullets[i].hitbox, t_game.player1.hitbox))
		{
			t_game.player1.life--;
			t_game.bullets.splice(i, 1);
			setTimeout(() => {
				if (gamesocket)
				{
					gamesocket.send(JSON.stringify({
						'message': 'touch',
						'player': 'player1',
						'life': t_game.player1.life,
					}));
				}
			}, 100);
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
	if (start === 0)
		return ;
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
	if (gamesocket)
		beplayer = t_game.player2;
	else if (bebousocket)
		beplayer = t_game.player1;
	else
		beplayer = t_game.player2;
	bullets = [];
}

function startGame()
{
	if (start === 1)
		return ;
	countdown();
	initvariables();
	start = 1;
	setTimeout(sendmove, 4000);
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
	if (event.key === "ArrowLeft" && t_game.player1.left === 0 && beplayer === t_game.player1)
	{
		t_game.player1.dx -= 7;
		t_game.player1.left = 1;
	}
	else if (event.key === "ArrowRight" && t_game.player1.right === 0 && beplayer === t_game.player1)
	{
		t_game.player1.dx += 7;
		t_game.player1.right = 1;
	}
	else if (event.key === "ArrowUp" && t_game.player1.up === 0 && beplayer === t_game.player1)
	{
		t_game.player1.dy -= 7;
		t_game.player1.up = 1;
	}
	else if (event.key === "ArrowDown" && t_game.player1.down === 0 && beplayer === t_game.player1)
	{
		t_game.player1.dy += 7;
		t_game.player1.down = 1;
	}
	else if ((event.key === "a" || event.key === "q") && t_game.player2.left === 0 && beplayer === t_game.player2)
	{
		t_game.player2.dx -= 7;
		t_game.player2.left = 1;
	}
	else if (event.key === "d" && t_game.player2.right === 0 && beplayer === t_game.player2)
	{
		t_game.player2.dx += 7;
		t_game.player2.right = 1;
	}
	else if ((event.key === "w" || event.key === "z") && t_game.player2.up === 0 && beplayer === t_game.player2)
	{
		t_game.player2.dy -= 7;
		t_game.player2.up = 1;
	}
	else if (event.key === "s" && t_game.player2.down === 0 && beplayer === t_game.player2)
	{
		t_game.player2.dy += 7;
		t_game.player2.down = 1;
	}
	if (event.key === "f" && beplayer === t_game.player1)
	{
		if (now - lasshootplayer1 < 100)
			return ;
		lasshootplayer1 = now;
		if (bebousocket)
			bebousocket.send(JSON.stringify({
				'message': 'shoot',
				'bullet': new Bullet(t_game.player1.x - t_game.player1.width / 2 + (modelebullet.length / 2) * 10, t_game.player1.y + t_game.player1.height, 10, 10, 0, -1, 20, 1, "player1", [t_game.player1.x + t_game.player1.width / 2, t_game.player1.y + t_game.player1.height, 10, 10]),
			}));
		else
			t_game.bullets.push(new Bullet(t_game.player1.x - t_game.player1.width / 2 + (modelebullet.length / 2) * 10 , t_game.player1.y + t_game.player1.height, 10, 10, 0, -1, 20, 1, "player1", [t_game.player1.x + t_game.player1.width / 2, t_game.player1.y + t_game.player1.height, 10, 10]));
	}
	if (event.key === " " && beplayer === t_game.player2)
	{
		if (now - lasshootplayer2 < 100)
			return ;
		lasshootplayer2 = now;
		if (gamesocket)
		{
			gamesocket.send(JSON.stringify({
				'message': 'shoot',
				'bullet': new Bullet(t_game.player2.x - t_game.player2.width / 2 + (modelebullet.length / 2) * 10, t_game.player2.y - t_game.player2.height, 10, 10, 0, 1, 20, 1, "player2", [t_game.player2.x + t_game.player2.width / 2, t_game.player2.y - t_game.player2.height, 10, 10]),
			}));
		}
		else
			t_game.bullets.push(new Bullet(t_game.player2.x - t_game.player2.width / 2 + (modelebullet.length / 2) * 10, t_game.player2.y - t_game.player2.height, 10, 10, 0, 1, 20, 1, "player2", [t_game.player2.x + t_game.player2.width / 2, t_game.player2.y - t_game.player2.height, 10, 10]));
	}
}
					
document.addEventListener('keydown', function(event)
{
	if (chatbox.style.display !== "none")
		;
	else if (start === 1 && forcountdown === 0)
		keyhookdownforgame(event);
});

/*up*/

function keyhookupforgame(event)
{
	if (start === 0 || forcountdown === 1)
		return ;
	if (event.key === "ArrowLeft" && t_game.player1.left === 1 && beplayer === t_game.player1)
	{
		t_game.player1.dx += 7;
		t_game.player1.left = 0;
	}
	else if (event.key === "ArrowRight" && t_game.player1.right === 1 && beplayer === t_game.player1)
	{
		t_game.player1.dx -= 7;
		t_game.player1.right = 0;
	}
	else if (event.key === "ArrowUp" && t_game.player1.up === 1 && beplayer === t_game.player1)
	{
		t_game.player1.dy += 7;
		t_game.player1.up = 0;
	}
	else if (event.key === "ArrowDown" && t_game.player1.down === 1 && beplayer === t_game.player1)
	{
		t_game.player1.dy -= 7;
		t_game.player1.down = 0;
	}
	else if ((event.key === "a" || event.key === "q") && t_game.player2.left === 1 && beplayer === t_game.player2)
	{
		t_game.player2.dx += 7;
		t_game.player2.left = 0;
	}
	else if (event.key === "d" && t_game.player2.right === 1 && beplayer === t_game.player2)
	{
		t_game.player2.dx -= 7;
		t_game.player2.right = 0;
	}
	else if ((event.key === "w" || event.key === "z") && t_game.player2.up === 1 && beplayer === t_game.player2)
	{
		t_game.player2.dy += 7;
		t_game.player2.up = 0;
	}
	else if (event.key === "s" && t_game.player2.down === 1 && beplayer === t_game.player2)
	{
		t_game.player2.dy -= 7;
		t_game.player2.down = 0;
	}

}

document.addEventListener('keyup', function(event)
{
	if (chatbox.style.display !== "none")
		return;
	if (event.key === "r")
		startGame();
	else if (event.key === "o" || event.key === "O")
		toggleFullscreen(canvas);
	if (start === 1 && forcountdown === 0)
		keyhookupforgame(event);
});


/*============================================CHAT============================================*/

async function sendInvite(event)
{
	if (event.key === "Enter")
	{
		let playername = inviteinput.value;
		if (await checkPlayer(playername))
		{
			if (gamesocket == undefined)
				gamesocket = new WebSocket(`${wsProtocol}//${window.location.host}/ws/spacebattle/`);
			inviteinput.style.display = "none";
			divofbox.style.display = "block";
			// putnameinbox(await getUserName());

			gamesocket.onmessage = function(event)
			{
				const data = JSON.parse(event.data);
				// console.log(data);

				if (data.message.includes('disconnected'))
				{
					start = 0;
					let playerdisconnect = data.message.split(' ')[0];
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.fillStyle = colorset.backgroundcolor;
					context.fillRect(0, 0, canvas.width, canvas.height);
					context.fillStyle = colorset.fontcolor;
					context.font = "50px Arial";
					context.fillText(playerdisconnect + " disconnected", canvas.width / 2 - sizeofstringdisplayed(playerdisconnect + " disconnected").width / 2, canvas.height / 2);
					while (divofbox.firstChild)
						divofbox.removeChild(divofbox.firstChild);
					inviteinput.style.display = "block";
					gamesocket.close();
					gamesocket = undefined;
					setTimeout(wait, 2000);
					return ;
				}
				else if (data.message.includes('connected'))
				{
					putnameinbox(data.message.split(' ')[0]);
				}
				else if (data.message === 'start')
					startGame();
				else if (data.message.includes('move'))
				{
					if (data.player === 'player1')
					{
						t_game.player1.y = data.y;
						t_game.player1.x = data.x;
					}
				}
				else if (data.message === 'shoot')
				{
					t_game.bullets.push(Bullet.copy(data.bullet));
				}
			}
		
			gamesocket.onopen = function(event)
			{
				console.log('websocket open on spacebattle');
			}
	
			setTimeout(() =>{
				if (document.getElementById('game-info-player'))
					document.getElementById('game-info-player').style.display = "flex";
				if (document.getElementById('playername'))
					document.getElementById('playername').style.display = "flex";
			}, 200);

			inviteinput.value = '';

			if (!allconversations[playername])
				allconversations[playername] = [];
			allconversations[playername].push({
				'from': 'You',
				'message': 'Invite ' + playername + ' to join a game of ' + gameName,
			});
			socket.send(JSON.stringify({
				'to': playername,
				'message': 'Invating you to play : ' + gameName,
				'is_invite': true,
				'tournament': false,
			}));
		}
		else
			console.log('Player not found');
	}
}

inviteinput.addEventListener('keydown', sendInvite);

/*============================================ONLINE============================================*/

function sendmove()
{
	if (gamemode === "online" && start === 1)
	{
		setInterval(() => {
			if (start === 0)
				return ;
			if (bebousocket)
			{
				bebousocket.send(JSON.stringify({
					'message': 'move',
					'player': 'player1',
					'playerx': t_game.player1.x,
					'playery': t_game.player1.y,
					'bullets': t_game.bullets,
				}));
			}
			else if (gamesocket)
			{
				gamesocket.send(JSON.stringify({
					'message': 'move',
					'player': 'player2',
					'playerx': t_game.player2.x,
					'playery': t_game.player2.y,
					'bullets': t_game.bullets,
				}));
			}
		}, 1000 / 20);
	}
	else if (gamemode === "online_tournament" && start === 1)
	{
		if (is_host === true || doubleia === 1)
		{
			setInterval(async () =>
			{
				if (start === 0)
					return ;
			} , 1000 / 20);
		}
	}
}

if (gamemode === "online" && joinagame)
	{
		is_host = false;
		if (bebousocket == undefined)
			bebousocket = new WebSocket(`${wsProtocol}//${window.location.host}/ws/spacebattle/`)
		bebousocket.onmessage = function(event)
		{
			const data = JSON.parse(event.data);
			// console.log("data", data);

			if (data.message.includes('disconnected'))
			{
				start = 0;
				let playerdisconnect = data.message.split(' ')[0];
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = colorset.backgroundcolor;
				context.fillRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = colorset.fontcolor;
				context.font = "50px Arial";
				context.fillText(playerdisconnect + " disconnected", canvas.width / 2 - sizeofstringdisplayed(playerdisconnect + " disconnected").width / 2, canvas.height / 2);
				while (divofbox.firstChild)
					divofbox.removeChild(divofbox.firstChild);
				inviteinput.style.display = "block";
				bebousocket.close();
				bebousocket = undefined;
				setjoinagame(false);
				setTimeout(wait, 2000);
				return ;
			}
			else if (data.message.includes('connected'))
			{
				setTimeout(() => {
				{
					putnameinbox(data.message.split(' ')[0]);
					document.getElementById('game-info-player').style.display = "flex";
					document.getElementById('playername').style.display = "flex";
					document.getElementById('invite').style.display = "none";

				}}, 200);
			}
			else if (data.message === 'start')
				startGame();
			else if (data.message.includes('move'))
			{
				if (data.player === 'player2')
				{
					t_game.player2.y = data.y;
					t_game.player2.x = data.x;
				}
			}
			// else if (data.message === 'touch')
			// {
			// 	if (data.player === 'player1')
			// 		t_game.player1.life = data.life;
			// 	else if (data.player === 'player2')
			// 		t_game.player2.life = data.life;
			// }
			else if (data.message === 'shoot')
			{
				t_game.bullets.push(Bullet.copy(data.bullet));
			}
			else if (data.message === 'end')
			{
				start = 0;
				if (t_game.player1.life <= 0)
					prinsmg(context, "Player 2 wins", canvas.width / 2 - 150, canvas.height / 2);
				else if (t_game.player2.life <= 0)
					prinsmg(context, "Player 1 wins", canvas.width / 2 - 150, canvas.height / 2);
				setTimeout(wait, 2000);
			}
		}
	}

if (gamemode === "online")
	{
		redbutton.addEventListener("click", () =>
		{
			if (start === 0)
			{
				console.log('start');
				if (gamesocket)
				{
					gamesocket.send(JSON.stringify({
						'message': 'start',
					}));
				}
				else if (bebousocket)
				{
					bebousocket.send(JSON.stringify({
						'message': 'start',
					}));
				}
				startGame();
			}
		});
	}

}

export { loadSpaceInvadersGame }