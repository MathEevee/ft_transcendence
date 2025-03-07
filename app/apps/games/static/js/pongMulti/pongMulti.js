import { Ball } from "/static/js/pongMulti/ball.js";
import { Player } from "/static/js/pongMulti/player.js";
import { point } from "/static/js/pongMulti/point.js";
import { sizeofstringdisplayed } from "/static/js/pongMulti/utils.js";
import { lasthit } from "/static/js/pongMulti/player.js";
import { setPageDestructor } from "/static/js/index.js";

function update_score(score1, score2, score3, score4)
{
	document.getElementById('playerMulti1').textContent = score1;
	document.getElementById('playerMulti2').textContent = score2;
	document.getElementById('playerMulti3').textContent = score3;
	document.getElementById('playerMulti4').textContent = score4;
}

function set_new_id(playerid, username)
{
	let removed = 0;
	document.getElementById('playerMulti1').textContent = '0';
	document.getElementById('playerMulti2').textContent = '0';
	document.getElementById('playerMulti3').textContent = '0';
	document.getElementById('playerMulti4').textContent = '0';
    let playerNames = document.querySelectorAll('#player-info-multi .multi-player h3');
	if (playerNames[0].textContent === "Player 1" && playerNames[1].textContent !== "Player 2")
	{
		playerNames[0].textContent = playerNames[1].textContent;
		playerNames[1].textContent = "Player 2";
		removed++;
	}
	if (playerNames[1].textContent === "Player 2" && playerNames[2].textContent !== "Player 3")
	{
		playerNames[1].textContent = playerNames[2].textContent;
		playerNames[2].textContent = "Player 3";
		removed++;
	}
	if (playerNames[2].textContent === "Player 3" && playerNames[3].textContent !== "Player 4")
	{
		playerNames[2].textContent = playerNames[3].textContent;
		playerNames[3].textContent = "Player 4";
		removed++;
	}
	if (playerNames[3].textContent === "Player 4" && playerid === 5)
	{
		playerNames[3].textContent = username;
	}
	if (removed !== 0)
	{
		if (playerid > removed)
			playerid -= removed;
	}
	return playerid;
}

function create_scoreboard(username, playerid)
{
    let playerNames = document.querySelectorAll('#player-info-multi .multi-player h3');
    
	if (playerid === 1)
	{
		playerNames[0].textContent = username;
	}
	else if (playerid === 2)
	{
		playerNames[1].textContent = username;
	}
	else if (playerid === 3)
	{
		playerNames[2].textContent = username;
	}
	else if (playerid === 4)
	{
		playerNames[3].textContent = username;
	}
}

async function loadPongMulti(){
	let interval = null;
	const canvas = document.getElementById('pong');
	const context = canvas.getContext('2d');
	const redbutton = document.getElementById('red');
	const chatbox = document.getElementById('box');
	const divofbox = document.getElementById('game-info-player');
	chatbox.style.display = "none";

	

	let playerid = 1;
	
	var all_players = [];
	
	let speed = 10;
	let start = 0;
	const paddleHeight = 75;
	const paddleWidth = 5;
	let is_host = true;
	
	var playername = "";
	
	async function getUserName() {
		const response = await fetch('/authe/api/me/');
		const data = await response.json();
		return data.username;
	}
	
	playername = await getUserName();
	all_players.push(playername);
	
	const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const wsURL = `${wsProtocol}//${window.location.host}/ws/pong/multiplayer/`;
	let socket;

	if (socket === undefined)
		socket = new WebSocket(wsURL);

	function remove_in_tab(removed)
	{
		let playerNames = document.querySelectorAll('#player-info-multi .multi-player h3');
		let removedid = 0;

		if (playerNames[0].textContent === removed)
			removedid = 1;
		else if (playerNames[1].textContent === removed)
			removedid = 2;
		else if (playerNames[2].textContent === removed)
			removedid = 3;
		else if (playerNames[3].textContent === removed)
			removedid = 4;

		if (start === 0 && removedid !== 0)
		{
			for (let i = removedid - 1; i < 3; i++)
			{
				playerNames[i].textContent = playerNames[i + 1].textContent;
				if (playerNames[i].textContent === "Player 3" && i === 1)
					playerNames[i].textContent = "Player 2";
				if (playerNames[i].textContent === "Player 4" && i === 2)
					playerNames[i].textContent = "Player 3";
			}
			if (playerid > removedid)
				playerid--;
			if (playerid === 1)
				is_host = true;
			playerNames[3].textContent = "Player 4";
		}
		else if (start === 1 && removedid !== 0)
		{
			if (removedid === 1)
				playerNames[0].textContent = "Player 1";
			else if (removedid === 2)
				playerNames[1].textContent = "Player 2";
			else if (removedid === 3)
				playerNames[2].textContent = "Player 3";
			else if (removedid === 4)
				playerNames[3].textContent = "Player 4";

			if (removedid === 1)
			{
				if (playerNames[1].textContent !== "Player 2" && playerid === 2)
					is_host = true;
				else if (playerNames[1].textContent === "Player 2" && playerNames[2].textContent !== "Player 3" && playerid === 3)
					is_host = true;
				else if (playerNames[1].textContent === "Player 2" && playerNames[2].textContent === "Player 3" && playerNames[3].textContent !== "Player 4" && playerid === 4)
					is_host = true;
			}
		}
	}

	setPageDestructor(() => {
		console.log("destroying pong multiplayer (destructor fn)");
		if (start === 1)
			socket.send(JSON.stringify({ 'message': "disconnected", 'player': playername , 'start': 'started', 'playerid': playerid}));
		else
			socket.send(JSON.stringify({ 'message': "disconnected", 'player': playername , 'start': 'not started', 'playerid': playerid}));
		socket.close();
	});

	if (socket.readyState === WebSocket.OPEN)
	{
		socket.send(JSON.stringify({ 'message': "join", 'player': playername , 'playerid': playerid}));
	}
	
	socket.onopen = function (e) {
		console.log("Connected to server");
		socket.send(JSON.stringify({ 'message': "join", 'player': playername, 'playerid': playerid }));
	};

	socket.onmessage = function (e) {
		const data = JSON.parse(e.data);
		if (data['message'] === "player_id")
		{
			playerid = data['value'];
			is_host = playerid === 1;

		}
		if (data['message'] === "join")
		{
			if (all_players.includes(data.player) === false)
			{
				socket.send(JSON.stringify({ 'message': "join", 'player': playername , 'playerid': playerid}));
				create_scoreboard(playername, playerid);
			}
			all_players.push(data.player);
			create_scoreboard(data['player'], data['playerid']);
		}
		if (data['message'] === "start")
		{
			startPong();
		}
		if (data['message'] === "disconnected")
		{
			let removeplayer = data['player'];
			if (playerid === 5)
				socket.send(JSON.stringify({ 'message': "join", 'player': playername , 'playerid': 4}));
			remove_in_tab(removeplayer);
			create_scoreboard(playername, playerid);
			all_players = all_players.filter(e => e !== removeplayer);
		}
	};

	const tabscore = document.getElementById('player-info-multi');
	tabscore.style.display = "block";

	const colorpalette = { white: "#FFFFFF", black: "#000000", red: "#FF0000", green: "#00FF00", blue: "#0000FF", yellow: "#FFFF00", cyan: "#00FFFF", magenta: "#FF00FF", silver: "#C0C0C0", gray: "#808080", maroon: "#800000", olive: "#808000", purple: "#800080", teal: "#008080", navy: "#000080", orange: "#FFA500", lime: "#00FF00", aqua: "#00FFFF", fuchsia: "#FF00FF", brown: "#A52A2A", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", purple: "#800080", red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", teal: "#008080", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32" };

	if (window.location.pathname === "/games/pong/multiplayer/")
	{
		// setTimeout(() => {
		// 	document.getElementById('game-info-player').style.display = "block";
		// 	document.getElementById('playername').style.display = "block";
		// }, 1000);
		//add score
	}

	

	const colorset =
	{
		fontcolor: colorpalette.white,
		backgroundcolor: colorpalette.black,
		ballcolor: colorpalette.cyan,
		team1: colorpalette.white,
		team2: colorpalette.blue,
		team3: colorpalette.green,
		team4: colorpalette.red,
		netcolor: colorpalette.white,
		scorecolor: colorpalette.white,
	};

	var cplayer;

	/*t_game*/
	var t_game = {
		player1: new Player(0, canvas.height / 2 - 50, 10, 100, colorset.team1),
		player2: new Player(0, canvas.height / 2 - 50, 10, 100, colorset.team2),
		player3: new Player(canvas.width - 10, canvas.height / 2 - 50, 10, 100, colorset.team3),
		player4: new Player(canvas.width - 10, canvas.height / 2 - 50,10,100, colorset.team4),
		ball: new Ball(canvas.width / 2, canvas.height / 2, 0, 0, 5, colorset.ballcolor, speed),
	};
	
	function toggleFullscreen(element) {
		if (window.location.pathname === "/games/pong/multiplayer/")
		{
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
	}
	/* Draw */
	
	function draw()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.backgroundcolor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		t_game.player1.draw(context);
		t_game.player2.draw(context);
		t_game.player3.draw(context);
		t_game.player4.draw(context);
		t_game.ball.draw(context);
	}

	function setballafterpoint(canvas, ball)
	{
		var ballplassement = new point(0, 0);
		ballplassement.x = Math.floor(Math.random() * 10);
		if (ballplassement.x % 3 === 0)
		{
			ballplassement.x = 0;
			ballplassement.y = Math.floor(Math.random() * 10);
			if (ballplassement.y % 2 === 0)
				ballplassement.y = 50;
			else
				ballplassement.y = -50;
		}
		else if (ballplassement.x % 3 === 1)
			ballplassement.x = 50;
		else
			ballplassement.x = -50;
		t_game.ball = new Ball(canvas.width / 2 + ballplassement.x, canvas.height / 2 + ballplassement.y, 0, 0, 5, colorset.ballcolor, speed / 4);
		if (ballplassement.x === 0)
			t_game.ball.dx = Math.random() * 0.5;
		else if (ballplassement.x === 50)
			t_game.ball.dx = -1;
		else
			t_game.ball.dx = -1;
		if (ballplassement.y === 0)
			t_game.ball.dy = Math.random() * 0.5;
		else if (ballplassement.y === 50)
			t_game.ball.dy = 1;
		else
			t_game.ball.dy = -1;
		socket.send(JSON.stringify({'message':"start ball",
			'ballx':t_game.ball.x, 'bally':t_game.ball.y ,'balldx':t_game.ball.dx, 'balldy':t_game.ball.dy, 'ballspeed':t_game.ball.speed}));
	}

	function setplayerafterpoint(canvas, player1, player2, player3, player4)
	{
		player1.x = 312.5;
		player1.y = 690;
		player3.x = 690;
		player3.y = 312.5;
		player2.x = 312.5;
		player2.y = 5;
		player4.x = 5;
		player4.y = 312.5;
		if (socket.readyState === WebSocket.OPEN)
		{
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 1, 'playerx': player1.x, 'playery': player1.y }));
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 2, 'playerx': player2.x, 'playery': player2.y }));
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 3, 'playerx': player3.x, 'playery': player3.y }));
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 4, 'playerx': player4.x, 'playery': player4.y }));
		}
	}

	function setafterpoint(canvas, player1, player2, player3, player4, ball)
	{
		if (is_host === true)
		{
			setballafterpoint(canvas, ball);
			setplayerafterpoint(canvas, player1, player2, player3, player4);
			socket.send(JSON.stringify({ 'message': "score", 'playerid': lasthit.lasthit}));
			lasthit.lasthit = null;
		}

	}

	function update()
	{
			socket.onmessage = function (e) {
			const data = JSON.parse(e.data);
			if (is_host === false && data['message'] === "move ball")
			{
				t_game.ball.dx = data['balldx'];
				t_game.ball.dy = data['balldy'];
			}
			if (is_host === false && data['message'] === "start ball")
			{
				t_game.ball.x = data['ballx'];
				t_game.ball.y = data['bally'];
				t_game.ball.dx = data['balldx'];
				t_game.ball.dy = data['balldy'];
				t_game.ball.speed = data['ballspeed'];
			}
			if (is_host === false && data['message'] === "end" && start === 1)
			{
				start = 0;
				return ;
				// print_score(player1, player2, player3, player4);
				// reset score
			}
			if (data['message'] === "move player")
			{
				if (data['playerid'] === 1)
				{
					t_game.player1.x = data['playerx'];
					t_game.player1.y = data['playery'];
					t_game.player1.update(canvas);
				}
				else if (data['playerid'] === 2)
				{
					t_game.player2.x = data['playerx'];
					t_game.player2.y = data['playery'];
					t_game.player2.update(canvas);
				}
				else if (data['playerid'] === 3)
				{
					t_game.player3.x = data['playerx'];
					t_game.player3.y = data['playery'];
					t_game.player3.update(canvas);
				}
				else if (data['playerid'] === 4)
				{
					t_game.player4.x = data['playerx'];
					t_game.player4.y = data['playery'];
					t_game.player4.update(canvas);
				}
			}
			if (data['message'] === "score")
			{
				if (data['playerid'] === 1)
					t_game.player1.score++;
				else if (data['playerid'] === 2)
					t_game.player2.score++;
				else if (data['playerid'] === 3)
					t_game.player3.score++;
				else if (data['playerid'] === 4)
					t_game.player4.score++;
				update_score(t_game.player1.score, t_game.player2.score, t_game.player3.score, t_game.player4.score);
			}
			if (data['message'] === "disconnected")
			{
				let removeplayer = data['player'];
				remove_in_tab(removeplayer);
			}
			if (data['message'] === "start" && start === 0)
			{
				playerid = set_new_id(playerid, playername);
				create_scoreboard(playername, playerid);
				startPong();
			}
			if (data['message'] === "join" && start === 0)
			{
				if (all_players.includes(data.player) === false)
				{
					socket.send(JSON.stringify({ 'message': "join", 'player': playername , 'playerid': playerid}));
					create_scoreboard(playername, playerid);
				}
				all_players.push(data.player);
				create_scoreboard(data['player'], data['playerid']);
			}
			if (data['message'] === "disconnected")
			{
				let removeplayer = data['player'];
				if (playerid === 5 && start === 0)
					socket.send(JSON.stringify({ 'message': "join", 'player': playername , 'playerid': 4}));
				remove_in_tab(removeplayer);
				create_scoreboard(playername, playerid);
				all_players = all_players.filter(e => e !== removeplayer);
			}
		};
	let result = t_game.ball.update(canvas, t_game.player1, t_game.player2, t_game.player3, t_game.player4, t_game.ball);
	if (is_host === true)
	{
		if (result)
		{
			if (result === 2)
			{
				if (t_game.ball.y - t_game.ball.radius <= 0 || t_game.ball.y + t_game.ball.radius >= canvas.height)
					setafterpoint(canvas, t_game.player1, t_game.player2, t_game.player3, t_game.player4, t_game.ball);
				else if (t_game.ball.x - t_game.ball.radius <= 0 || t_game.ball.x + t_game.ball.radius >= canvas.width)
					setafterpoint(canvas, t_game.player1, t_game.player2, t_game.player3, t_game.player4, t_game.ball);
			}
			else
			{
				socket.send(JSON.stringify({'message':"start ball",
				'ballx':t_game.ball.x, 'bally':t_game.ball.y ,'balldx':t_game.ball.dx, 'balldy':t_game.ball.dy, 'ballspeed':t_game.ball.speed}));
			}
		}
		if (t_game.player1.score >= 5 || t_game.player2.score >= 5 || t_game.player3.score >= 5 || t_game.player4.score >= 5)
		{
			socket.send(JSON.stringify({ 'message': "end"}));
			start = 0;
			// create_scoreboard(playername, playerid);
			// playerid = set_new_id(playerid, playername);
			return ;
		}
	}
	}
	
	function keyhookdownforgame(event)
	{
		if (playerid === 1)
		{
			if (event.key === "ArrowLeft")
				cplayer.goLeft();
			else if (event.key === "ArrowRight")
				cplayer.goRight();
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 1, 'playerx': cplayer.x, 'playery': cplayer.y }));
			cplayer.update(canvas);
		}

		else if (playerid === 2)
		{
			if (event.key === "ArrowLeft")
				cplayer.goLeft();
			else if (event.key === "ArrowRight")
				cplayer.goRight();
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 2, 'playerx': cplayer.x, 'playery': cplayer.y }));
			cplayer.update(canvas);
		}

		else if (playerid === 3)
		{
			if (event.key === "ArrowUp")
				cplayer.goUp();
			else if (event.key === "ArrowDown")
				cplayer.goDown();
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 3, 'playerx': cplayer.x, 'playery': cplayer.y }));
			cplayer.update(canvas);
		}

		else if (playerid === 4)
		{
			if (event.key === "ArrowUp")
				cplayer.goUp();
			else if (event.key === "ArrowDown")
				cplayer.goDown();
			socket.send(JSON.stringify({ 'message': "move player", 'playerid': 4, 'playerx': cplayer.x, 'playery': cplayer.y }));
			cplayer.update(canvas);
		}
	}
	
	/* Mouvement des raquettes */
	document.addEventListener("keydown", (event) =>
	{
		if (chatbox.style.display === "block")
			return ;
		if (start === 1)
			keyhookdownforgame(event);

	});
	
	function keyhookupforgame(event)
	{
		if (playerid === 1 || playerid === 2)
		{
			if (event.key === "ArrowLeft" || event.key === "ArrowRight")
			{
				t_game.player1.stop();
				t_game.player2.stop();
				socket.send(JSON.stringify({ 'message': "move player", 'playerid': playerid, 'playerx': cplayer.x, 'playery': cplayer.y }));
			}
		}
		else if (playerid === 3 || playerid === 4)
		{
			if (event.key === "ArrowUp" || event.key === "ArrowDown")
			{
				t_game.player3.stop();
				t_game.player4.stop();
				socket.send(JSON.stringify({ 'message': "move player", 'playerid': playerid, 'playerx': cplayer.x, 'playery': cplayer.y }));
			}
		}
	}
	
	document.body.addEventListener("keyup", (event) =>
	{
		if (chatbox.style.display === "block")
			return ;
		if (event.key === "r" || event.key === "R")
			startPong();
		else if (event.key === "o" || event.key === "O")
			toggleFullscreen(canvas);
		if (start === 1)
			keyhookupforgame(event);

	});

	/* Jeu */
	/* Fonctions utilitaires */
	function countdown()
	{
		let count = 3;
		const interval = setInterval(() => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = colorset.backgroundcolor;
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = colorset.fontcolor;
			context.font = "100px Arial";
			context.fillText(count, canvas.width / 2 - 25, canvas.height / 2 + 25);
			count--;
			if (count < 0)
			{
				clearInterval(interval);
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = colorset.backgroundcolor;
				context.fillRect(0, 0, canvas.width, canvas.height);
				context.fillText("GO!", canvas.width / 2 - 75, canvas.height / 2 + 25);
			}
		}, 1000);
	}
	
	function loop()
	{
		if (start === 0)
		{
			clearInterval(interval);
			wait();
			return ;
		}
		update();
		draw();
		requestAnimationFrame(loop);
	}


	
	function initvariables()
	{
		t_game.player1 = new Player(canvas.width / 2 - paddleHeight / 2, canvas.height - paddleWidth * 2, paddleHeight, paddleWidth, colorset.team1, speed * 1.5);
		t_game.player2 = new Player(canvas.width / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleWidth, colorset.team2, speed * 1.5);
		t_game.player3 = new Player(canvas.width - paddleWidth * 2, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, colorset.team3, speed * 1.5);
		t_game.player4 = new Player(paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, colorset.team4,speed * 1.5);
		var ballplassement = new point(0, 0);
		ballplassement.x = Math.floor(Math.random() * 10);
		if (ballplassement.x % 3 === 0)
		{
			ballplassement.x = 0;
			ballplassement.y = Math.floor(Math.random() * 10);
			if (ballplassement.y % 2 === 0)
				ballplassement.y = 50;
			else
				ballplassement.y = -50;
		}
		else if (ballplassement.x % 3 === 1)
			ballplassement.x = 50;
		else
			ballplassement.x = -50;
		t_game.ball = new Ball(canvas.width / 2 + ballplassement.x, canvas.height / 2 + ballplassement.y, 0, 0, 5, colorset.ballcolor, speed / 4);
		if (ballplassement.x === 0)
			t_game.ball.dx = Math.random() * 0.5;
		else if (ballplassement.x === 50)
			t_game.ball.dx = -1;
		else
			t_game.ball.dx = -1;
		if (ballplassement.y === 0)
			t_game.ball.dy = Math.random() * 0.5;
		else if (ballplassement.y === 50)
			t_game.ball.dy = 1;
		else
			t_game.ball.dy = -1;
		start = 1;
		if (is_host === true)
			socket.send(JSON.stringify({'message':"start ball",
			'ballx':t_game.ball.x, 'bally':t_game.ball.y ,'balldx':t_game.ball.dx, 'balldy':t_game.ball.dy, 'ballspeed':t_game.ball.speed}));
		if (playerid === 1)
		{
			cplayer = t_game.player1;
		}
		else if (playerid === 2)
		{
			cplayer = t_game.player2;
		}
		else if (playerid === 3)
		{
			cplayer = t_game.player3;
		}
		else if (playerid === 4)
		{
			cplayer = t_game.player4;
		}
	}
	
	function startPong()
	{
		if (start === 1)
			return ;
		initvariables();
		if (is_host === true)
			socket.send(JSON.stringify({'message':"move ball",
			'ballx':t_game.ball.x, 'bally':t_game.ball.y ,'balldx':t_game.ball.dx, 'balldy':t_game.ball.dy, 'ballspeed':t_game.ball.speed}));
		countdown();
		setTimeout(loop, 5000);
	}
	
	function wait()
	{
		if (start === 1)
			return ;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.backgroundcolor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("Press red button to start", canvas.width / 2 - sizeofstringdisplayed(context, "Press red button to start").width / 2, canvas.height / 2);
	}
	
	wait();
	redbutton.addEventListener("click", () =>
	{
		let playerNames = document.querySelectorAll('#player-info-multi .multi-player h3');
		if (playerNames[3].textContent === "Player 4" && start === 0)
		{
			alert("You need to be 4 players to start the game");
			return;
		}
		socket.send(JSON.stringify({ 'message': "start"}));
		startPong();
	});
}

export { loadPongMulti }