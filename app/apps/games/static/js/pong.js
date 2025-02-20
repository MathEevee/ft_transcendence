import { allconversations } from "/static/js/chatbox.js";
import { joinagame } from "/static/js/chatbox.js";
import { setPageDestructor } from "/static/js/index.js";
import { setjoinagame } from "/static/js/chatbox.js";

function loadPong() {
	let interval = null;
	const canvas = document.getElementById('pong');
	const context = canvas.getContext('2d');
	const redbutton = document.getElementById('red');
	const bluebutton = document.getElementById('blue');
	const chatbox = document.getElementById('box');
	const inviteinput = document.getElementById('invite');
	const divofbox = document.getElementById('game-info-player');
	const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	const wsURL = `${wsProtocol}//${window.location.host}/ws/chat/`;
	const socket = new WebSocket(wsURL);
	let gamesocket;
	let bebousocket;
	let readybutton;
	let pongtournamentsocket;
	var gameId = null;
	let tournament_id;
	chatbox.style.display = "none";
	
	async function getUserName() {
		const response = await fetch('/authe/api/me/');
		const data = await response.json();
		return data.username;
	}

setPageDestructor(() => {
	start = 0;
	if (interval)
		clearInterval(interval);
	interval = null;
	if (gamesocket)
		gamesocket.close();
	if (bebousocket)
		bebousocket.close();
	if (pongtournamentsocket)
		pongtournamentsocket.close();
	setjoinagame(false);
});

	
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
	
	const gameName = window.location.pathname.split('/')[2];

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
	// Joueurs
	const paddleWidth = 10;
	const paddleHeight = 100;
	const player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0, ismoving: false};
	const player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 , ismoving: false};
	
	let beplayer = player1;
	let is_host = true;
	let doubleia = 0;
	// Gamemode
	var gamemode = "";
	if (window.location.pathname === "/games/pong/local/")
		gamemode = "local";
	else if (window.location.pathname === "/games/pong/solo/")
		gamemode = "solo";
	else if (window.location.pathname === "/games/pong/online/")
	{
		inviteinput.style.display = "block";
		divofbox.style.display = "block";
		gamemode = "online";
	}
	else if (window.location.pathname === "/games/pong/online/tournament/")
	{
		readybutton = document.getElementById("ready-btn");
		gamemode = "online_tournament";	
	}
	let iaisactive = 0;
	if (gamemode === "solo")
		iaisactive = 1;
	// Balle
	const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 8, speed: 5, dx: 1, dy: Math.random() - 0.5 };
	
	//score
	let score1 = 0;
	let score2 = 0;
	
	let speed = 7;

	//AI
	let AIdest = canvas.height / 2 - paddleHeight / 2;
	let AItouch = 0;
	
	let start = 0;
	let option = 0;

	let playeria = player2;
	let matchId = 0;
	
	//options
	const colorpalette = ["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
	let colorindex = 0;
	
	const colorset =
	{
		fontcolor: colorpalette[0],
		backgroundcolor: colorpalette[1],
		ballcolor: colorpalette[0],
		player1color: colorpalette[0],
		player2color: colorpalette[0],
		netcolor: colorpalette[0],
		scorecolor: colorpalette[0],
	}
	
	const functionstochangeoption = [changeFontColor, changeBackgroundColor, changeBallColor, changePlayer1Color, changePlayer2Color, changeNetColor, changeScoreColor];
	let optionindex = 0;
	let keyoptionpressed = 0;
	

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

	async function getUserName()
	{
		const response = await fetch('/authe/api/me/');
		const data = await response.json();
		return data.username;
	}
	
	function putplayerinmatch(player1, player2)
	{
		const currentmatch = document.getElementsByClassName("tournament-player");
		const player1name = document.createElement("h3");
		const player2name = document.createElement("h3");

		player1name.setAttribute("id", "player1");
		player2name.setAttribute("id", "player2");
	
		// delete allcurrentmatch;
		for (let i = 0; i < currentmatch.length; i++)
		{
			while (currentmatch[i].firstChild)
				currentmatch[i].removeChild(currentmatch[i].firstChild);
		}
		
		player1name.textContent = player1;
		player2name.textContent = player2;
		currentmatch[0].appendChild(player1name);
		currentmatch[1].appendChild(player2name);
	}

	function isIA(player)
	{
		if (player.includes("AI"))
			return true;
		return false;
	}

	async function fetchNewlatch()
	{
		let response = await fetch('/authe/api/tournaments/');
		let data = await response.json();
		let tournament;

		for (let i = 0; i < data.length; i++)
		{
			if (data[i].type_pong === true)
			{
				tournament = data[i];
				break;
			}
		}

		if (tournament === undefined)
			return ;
		//delete all match
		const matchlist = document.getElementById("match-list");
		while (matchlist.firstChild)
			matchlist.removeChild(matchlist.firstChild);

		if (tournament.match_entries.length === 0)
			return ;
		for (let i = 0; i < tournament.match_entries.length; i++)
			putMatchList(tournament.match_entries[i]);
	}

	function inittournamentsocket()
	{
		if (pongtournamentsocket && pongtournamentsocket.readyState === WebSocket.OPEN)
			return ;
		pongtournamentsocket = new WebSocket(`${wsProtocol}//${window.location.host}/ws/pong/tournament/`);

		pongtournamentsocket.onopen = async () =>
		{
			console.log('connected to pong tournament');
		}

		pongtournamentsocket.onmessage = async (e) =>
		{
			const data = JSON.parse(e.data);
			// console.log("data", data);
			if (data.message === 'start')
				startPong();
			else if (data.message === 'move')
			{
				if (data.player === 'player1')
					player1.y = data.y;
				else if (data.player === 'player2')
					player2.y = data.y;
				if (data.ballx && data.bally)
				{
					ball.x = data.ballx;
					ball.y = data.bally;
				}
			}
			else if (data.message === 'point')
			{
				score1 = data.score1;
				score2 = data.score2;
				if (score1 === 5 || score2 === 5)
				{
					clearendgame();
					start = 0;
					matchId++;
					setTimeout(async  () => {
						await fetchNewlatch();
						startMatch(null);
					} , 2000);
				}
			}
			else if (data.message.includes('end tournament'))
			{
				console.log("end tournament");
				start = 0;
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillText(data.message, canvas.width / 2 - sizeofstringdisplayed(data.message).width / 2, canvas.height / 2);
				putplayerinmatch("", "");
			}
		}
		if (pongtournamentsocket.readyState === WebSocket.OPEN)
		{
			pongtournamentsocket.onclose = () =>
			{
				console.log('disconnected from pong tournament');
				pongtournamentsocket = null;
			}
		}
	}

	async function playerready()
	{
		readybutton.style.display = "none";
		if (pongtournamentsocket)
		{
			pongtournamentsocket.send(JSON.stringify({
				'message': 'ready',
				'player': await getUserName(),
			}));
		}
		if (iaisactive === 1)
			startPong();
	}

	async function isRealHost()
	{
		const response = await fetch('/authe/api/tournaments/');
		const data = await response.json();
		let tournament;
		let all_ia = 1;

		for (let i = 0; i < data.length; i++)
		{
			if (data[i].type_pong === true)
			{
				tournament = data[i];
				break;
			}
		}
		if (tournament === undefined)
			return false;
		for (let i = 0; i < tournament.player_entries.length; i++)
		{
			if (tournament.player_entries[i].player.username === await getUserName() && tournament.player_entries[i].is_host === true)
			{
				all_ia = 0;
				return true;
			}
			if (!tournament.player_entries[i].player.username.startsWith("AI_"))
				all_ia = 0;
		}
		if (all_ia === 1)
			return true;
		return false;
	}
	
	async function startMatch(match)
	{
		const matchlist = document.getElementById("match-list");
		if (matchlist.childElementCount === 0)
			return ;
		let playerone;
		let playertwo;
		if (match)
		{
			playerone = match.player1;
			playertwo = match.player2;
		}
		else
		{
			playerone = matchlist.firstChild.firstChild.textContent.split(" vs ")[0];
			playertwo = matchlist.firstChild.firstChild.textContent.split(" vs ")[1];
		}
		if (playerone === undefined || playertwo === undefined)
			return ;
	
		putplayerinmatch(playerone, playertwo);
		matchlist.removeChild(matchlist.firstChild);
		if (playerone === await getUserName() || playertwo === await getUserName())
		{
			doubleia = 0;
			if (!allconversations["other"])
				allconversations["other"] = [];
			allconversations["other"].push({
				'from': 'Tournament',
				'message': 'You are in a match hurry up!',
			});
			readybutton.style.display = "flex";
			if (playerone === await getUserName())
			{
				beplayer = player1;
				is_host = true;
			}
			else
			{
				beplayer = player2;
				if (isIA(playerone))
					is_host = true;
				else
					is_host = false;
			}
		}
		if (isIA(playerone))
		{
			playeria = player1;
			iaisactive = 1;
		}
		if (isIA(playertwo))
		{
			playeria = player2;
			iaisactive = 1;
		}
		if (isIA(playerone) && isIA(playertwo))
		{
			doubleia = 1;
			is_host = await isRealHost();
			if (is_host && pongtournamentsocket)
			{
				pongtournamentsocket.send(JSON.stringify({
					'message': 'start',
				}));
				startPong();
			}
		}
		readybutton.addEventListener('click', playerready);
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
		const redbutton = document.getElementById('red');
		let tournament;

		redbutton.disabled = true;
		redbutton.style.display = "none";
		
		for (let i = 0; i < data.length; i++)
		{
			if (data[i].type_pong === true)
				{
					tournament = data[i];
					tournament_id = tournament.id;
					break;
				}
			}
			
		if (tournament === undefined)
			return ;
		inittournamentsocket();
		for (let i = 0; i < tournament.match_entries.length; i++)
			putMatchList(tournament.match_entries[i]);
		
		await startMatch(tournament.match_entries[0]);
		tournament.match_entries.pop();
	}
	
	if (document.location.pathname === "/games/pong/online/tournament/")
	{
		document.getElementById("tournamentbox").style.display = "block";
		displayTournamentGame();
	}

	function sizeofstringdisplayed(string)
	{
		return (context.measureText(string));
	}
	
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
			drawRect(canvas.width / 2 - 1, i, 2, 10, colorset.netcolor);
		}
	}
	
	function drawScore() {
		context.fillStyle = colorset.scorecolor;
		context.font = "35px Arial";
		context.fillText(score1, canvas.width / 4, 50);
		context.fillText(score2, 3 * canvas.width / 4, 50);
	}
	
	function draw() {
		drawRect(0, 0, canvas.width, canvas.height, colorset.backgroundcolor); // Fond
		drawNet();
		drawRect(player1.x, player1.y, player1.width, player1.height, colorset.player1color); // Raquette joueur 1
		drawRect(player2.x, player2.y, player2.width, player2.height, colorset.player2color); // Raquette joueur 2
		drawCircle(ball.x, ball.y, ball.radius, colorset.ballcolor); // Balle
		drawScore();
	}
	
	function changeColor()
	{
		if (optionindex === 0)
			colorset.fontcolor = colorpalette[colorindex];
		else if (optionindex === 1)
			colorset.backgroundcolor = colorpalette[colorindex];
		else if (optionindex === 2)
			colorset.ballcolor = colorpalette[colorindex];
		else if (optionindex === 3)
			colorset.player1color = colorpalette[colorindex];
		else if (optionindex === 4)
			colorset.player2color = colorpalette[colorindex];
		else if (optionindex === 5)
			colorset.netcolor = colorpalette[colorindex];
		else if (optionindex === 6)
			colorset.scorecolor = colorpalette[colorindex];
	}
	
	function drawoptioninstruction()
	{
		context.fillStyle = colorset.fontcolor;
		context.font = "20px Arial";
		context.fillText("Press Enter to change option.", 20, canvas.height - 20);
		context.fillText("Press Left or Right to change color.", 20, canvas.height - 40);
	}
	
	function drawcurrencolorpalette(x, y)
	{
		context.fillStyle = colorset.fontcolor;
		context.font = "80px Arial";
		context.fillText("<", x, y);
		context.font = "50px Arial";
		context.fillText(colorset[Object.keys(colorset)[optionindex]], x + 55, y - 10);
		context.font = "80px Arial";
		context.fillText(">", x + 270, y);
	}
	
	function changeFontColor(colorname)
	{
		drawoptioninstruction();
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("FONT COLOR:", canvas.width / 2 - 150, 100);
		drawcurrencolorpalette(200, 200);
	}
	
	function changeBackgroundColor(colorname)
	{
		drawoptioninstruction();
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("BACKGROUND COLOR:", canvas.width / 2 - 250, 100);
		drawcurrencolorpalette(200, 200);
	}
	
	function changeBallColor(colorname)
	{
		drawoptioninstruction();
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("BALL COLOR:", canvas.width / 2 - 150, 100);
		drawcurrencolorpalette(200, 200);
		drawCircle(canvas.width / 2, canvas.height / 2, 50, colorset.ballcolor);
	}
	
	function changePlayer1Color(colorname)
	{
		drawoptioninstruction();
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("PLAYER 1 COLOR:", canvas.width / 2 - 200, 100);
		drawcurrencolorpalette(200, 200);
		drawRect(200, canvas.height / 2 + 20, 320, 30, colorset.player1color);
	}
	
	function changePlayer2Color(colorname)
	{
		drawoptioninstruction();
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("PLAYER 2 COLOR:", canvas.width / 2 - 200, 100);
		drawcurrencolorpalette(200, 200);
		drawRect(200, canvas.height / 2 + 20, 320, 30, colorset.player2color);
	}
	
	function changeNetColor(colorname)
	{
		drawoptioninstruction();
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("NET COLOR:", canvas.width / 2 - 150, 100);
		drawcurrencolorpalette(200, 200);
		drawNet();
	}
	
	function changeScoreColor(colorname)
	{
		drawoptioninstruction();
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		context.fillText("SCORE COLOR:", canvas.width / 2 - 180, 100);
		drawcurrencolorpalette(200, 200);
		drawScore();
	}

	function clearendgame()
	{
		if(iaisactive === 1)
		{
			if (interval)
			{
				clearInterval(interval);
				console.log("interval cleared");
			}
			interval = null;
		}
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.backgroundcolor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.fontcolor;
		context.fillText(score1 === 5 ? "Player 1 wins!" : "Player 2 wins!", canvas.width / 2 - sizeofstringdisplayed(score1 === 5 ? "Player 1 wins!" : "Player 2 wins!").width / 2, canvas.height / 2);
		setTimeout(wait, 2000);
	}
	
	
	function keyhookdownforgame(event)
	{
		if (event.key === "ArrowUp" && player2.up !== 1 && (gamemode === "local" || beplayer === player2))
		{
			player2.up = 1;
			player2.dy += -speed;
		}
		else if (event.key === "ArrowDown" && player2.down !== 1 && (gamemode === "local" || beplayer === player2))
		{
			player2.down = 1;
			player2.dy += speed;
		}
		else if ((event.key === "z" || event.key === "w") && player1.up !== 1 && beplayer === player1)
		{
			player1.up = 1;
			player1.dy += -speed;
		}
		else if (event.key === "s" && player1.down !== 1 && beplayer === player1)
		{
			player1.down = 1;
			player1.dy += speed;
		}
	}
	
	function keyhookdownforoption(event)
	{
		keyoptionpressed = 0;
	}
	
	/* Mouvement des raquettes */
	document.addEventListener("keydown", (event) =>
	{
		if (chatbox.style.display !== "none" || start === 0 || doubleia === 1)
			return ;
		else if (start === 1)
			keyhookdownforgame(event);
		else if (option === 1)
			keyhookdownforoption(event);
	});
		
	function keyhookupforoption(event)
	{
		if (event.key === "Enter" && keyoptionpressed === 0)
		{
			if (optionindex === functionstochangeoption.length - 1)
			{
				option = 0;
				optionindex = 0;
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = colorset.backgroundcolor;
				context.fillRect(0, 0, canvas.width, canvas.height);
				wait();
				return ;
			}
			optionindex++;
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = colorset.backgroundcolor;
			context.fillRect(0, 0, canvas.width, canvas.height);
			functionstochangeoption[optionindex](colorset.fontcolor);
		}
		else if (event.key === "ArrowLeft" && keyoptionpressed === 0)
		{
			colorindex++;
			if (colorindex >= colorpalette.length)
				colorindex = 0;
			changeColor();
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = colorset.backgroundcolor;
			context.fillRect(0, 0, canvas.width, canvas.height);
			functionstochangeoption[optionindex](colorpalette[colorindex]);
		}
		else if (event.key === "ArrowRight" && keyoptionpressed === 0)
		{
			colorindex--;
			if (colorindex < 0)
				colorindex = colorpalette.length - 1;
			changeColor();
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = colorset.backgroundcolor;
			context.fillRect(0, 0, canvas.width, canvas.height);
			functionstochangeoption[optionindex](colorpalette[colorindex]);
		}
		keyoptionpressed = 1;
	}
	
	function keyhookupforgame(event)
	{
		if (event.key === "ArrowUp" && player2.up === 1 && (gamemode === "local" || beplayer === player2))
		{
			player2.up = 0;
			player2.dy -= -speed;
		}
		else if (event.key === "ArrowDown" && player2.down === 1 && (gamemode === "local" || beplayer === player2))
		{
			player2.down = 0;
			player2.dy -= speed;
		}
		else if ((event.key === "z" || event.key === "w") && player1.up === 1 && beplayer === player1)
		{
			player1.up = 0;
			player1.dy -= -speed;
		}
		else if (event.key === "s" && player1.down === 1 && beplayer === player1)
		{
			player1.down = 0;
			player1.dy -= speed;
		}
	}
	
	document.body.addEventListener("keyup", (event) =>
	{
		if (chatbox.style.display !== "none")
			return ;
		if (option === 1)
			keyhookupforoption(event);
		if (start === 0)
			return ;
		if (event.key === "r")
			startPong();
		else if (event.key === "b")
			startOption();
		else if (event.key === "o" || event.key === "O")
			toggleFullscreen(canvas);
		if (start === 1)
			keyhookupforgame(event);
	});
	
	function playerMove()
	{
		if (start === 0)
			return ;
		player1.y += player1.dy;
		player1.y = Math.max(Math.min(player1.y, canvas.height - paddleHeight), 0);
		if (gamemode === "local" || gamemode === "online" || gamemode === "online_tournament")
		{
			player2.y += player2.dy;
			player2.y = Math.max(Math.min(player2.y, canvas.height - paddleHeight), 0);
		}
		if (iaisactive === 1 && is_host === true)
		{
			if (doubleia === 0)
			{
				if ((AItouch === 0 && playeria === player2) || (AItouch === 1 && playeria === player1))
				{
					if (playeria === player2)
					{
						if (AIdest > player2.y && AIdest < player2.y + paddleHeight)
							return ;
						if (player2.y < AIdest)
							player2.y += speed;
						else if (player2.y > AIdest)
							player2.y -= speed;
					}
					else if (playeria === player1)
					{
						if (AIdest > player1.y && AIdest < player1.y + paddleHeight)
							return ;
						if (player1.y < AIdest)
							player1.y += speed;
						else if (player1.y > AIdest)
							player1.y -= speed;
					}
				}
			}
			else if (doubleia === 1)
			{
				if (AItouch === 0)
				{
					if (AIdest > player2.y && AIdest < player2.y + paddleHeight)
						return ;
					if (player2.y < AIdest)
						player2.y += speed;
					else if (player2.y > AIdest)
						player2.y -= speed;
				}
				if (AItouch === 1)
				{
					if (AIdest > player1.y && AIdest < player1.y + paddleHeight)
						return ;
					if (player1.y < AIdest)
						player1.y += speed;
					else if (player1.y > AIdest)
						player1.y -= speed;
				}
			}
			player2.y = Math.max(Math.min(player2.y, canvas.height - paddleHeight), 0);
		}

	}
	
	function ballMove()
	{
		ball.y += ball.dy * ball.speed;
		ball.x += ball.dx * ball.speed;
		if(gamesocket && start === 1)
		{
			gamesocket.send(JSON.stringify({
				'message': 'move',
				'ballx': ball.x,
				'bally': ball.y,
			}));
		}
	}
	
	function ballCollision()
	{
		if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0)
		{
			if (ball.y + ball.radius > canvas.height)
				ball.y = canvas.height - ball.radius;
			else
				ball.y = ball.radius;
			ball.dy *= -1;
		}
		else if (ball.x - ball.radius < player1.x + player1.width && ball.y > player1.y && ball.y < player1.y + player1.height)
		{
			ball.dx *= -1;
			ball.dy = (ball.y - (player1.y + player1.height / 2)) / player1.height / 2;
			ball.speed += 1;
			ball.x = player1.x + player1.width + ball.radius;
			AItouch = 0;
		}
		else if (ball.x + ball.radius > player2.x && ball.y > player2.y && ball.y < player2.y + player2.height)
		{
			ball.dx *= -1;
			ball.dy = (ball.y - (player2.y + player2.height / 2)) / player2.height / 2;
			ball.speed += 1;
			ball.x = player2.x - player2.width - ball.radius;
			AItouch = 1;
		}
	}
	
	function increaseScore()
	{
		if (beplayer === player1)
		{
			if (ball.x < 0)
				score2++;
			else
				score1++;
			if (gamesocket)
			{
				gamesocket.send(JSON.stringify({
					'message': 'point',
					'score1': score1,
					'score2': score2,
				}));
			}
			if (is_host)
			{
				if(pongtournamentsocket)
				{
					pongtournamentsocket.send(JSON.stringify(
						{
						'message': 'point',
						'score1': score1,
						'score2': score2,
						}));
					}
				}
		}
		else if (beplayer === player2 && is_host === true && pongtournamentsocket)
		{
			if (ball.x < 0)
				score2++;
			else
				score1++;
			if (is_host && pongtournamentsocket)
			{
				pongtournamentsocket.send(JSON.stringify({
					'message': 'point',
					'score1': score1,
					'score2': score2,
				}));
			}
		}
		if (score1 === 5 || score2 === 5)
		{
			clearendgame();
			if (gamemode === "online")
			{
				if (gamesocket && gameId)
				{
					gamesocket.send(JSON.stringify({
						'message': 'end',
					}));
					fetch('/games/pong_online/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
						},
						body: JSON.stringify({
							'id' : gameId,
							'ended_at': Date.now(),
							'score1': score1,
							'score2': score2,
						})
					})
				}
				else if (bebousocket && gameId)
				{
					bebousocket.send(JSON.stringify({
						'message': 'end',
					}));
					fetch('/games/pong_online/', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
						},
						body: JSON.stringify({
							'id' : gameId,
							'ended_at': Date.now(),
							'score1': score1,
							'score2': score2,
						})
					})
				}
				gameId = null;
			}
			else if (gamemode === "online_tournament")
			{
				if (is_host && pongtournamentsocket)
				{
					pongtournamentsocket.send(JSON.stringify({
						'message': 'end',
						'score1': score1,
						'score2': score2,
						'winner': score1 === 5 ? document.getElementById("player1").textContent : document.getElementById("player2").textContent,
						'match_id': matchId,
						'player1': document.getElementById("player1").textContent, 
						'player2': document.getElementById("player2").textContent,
						'tournament_type': window.location.pathname.split("/")[2],
					}));
				}
			}
			else if (iaisactive === 1 && gamemode === "solo")
			{
				fetch('/games/local-ia-end/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content'),
					},
					body: JSON.stringify({
						'id' : gameId,
						'ended_at': Date.now(),
						'score_player': score1,
						'score_IA': score2,
					})
				})
				.then(response => response.json())
				.then(data => {
					gameId = null;
				})
			}
			//send end game score + set gameid = NULL
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
			AIdest = canvas.height / 2 - paddleHeight / 2;
		}
	}

	// calcul de la destination du joueur 2 suivant le point d arrivéé de la balle
	function calplayerdest()
	{
		if (start === 0)
			return ;
		let playerdest = player2.y;
		if (playeria === player1)
			playerdest = player1.y;
		let balldest = ball.y;
		let dist = 0;
		let step = 0;

		if (ball.dx > 0)
		{
			dist = canvas.width - ball.x;
			step = dist / ball.speed;

			while (step > 0)
			{
				balldest += ball.dy * ball.speed;
				if (balldest < 0 || balldest > canvas.height)
					balldest = balldest < 0 ? -balldest : 2 * canvas.height - balldest;
				step--;
			}
			playerdest = balldest;
		}
		else
		{
			dist = ball.x;
			step = dist / ball.speed;

			while (step > 0)
			{
				balldest += ball.dy * ball.speed;
				if (balldest < 0 || balldest > canvas.height)
					balldest = balldest < 0 ? -balldest : 2 * canvas.height - balldest;
				step--;
			}
			playerdest = balldest;

		}
		return playerdest;
	}

	function updateAI()
	{
		if (start === 0 || iaisactive === 0)
		{
			if (interval)
				clearInterval(interval);
			interval = null;
			return ;
		}
		AIdest = calplayerdest();
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
		// is_host = is_host === 1 ? true : false;
		if (is_host === true)
		{
			if (update() || start === 0)
				return 1;
		}
		draw();
		requestAnimationFrame(loop);
	}
	
	function initvariables()
	{
		score1 = 0;
		score2 = 0;
		player1.y = canvas.height / 2 - paddleHeight / 2;
		player2.y = canvas.height / 2 - paddleHeight / 2;
		ball.x = canvas.width / 2;
		ball.y = canvas.height / 2;
		ball.speed = 5;
		ball.dx = 1;
		ball.dy = Math.random() - 0.5;
		player1.dy = 0;
		player2.dy = 0;
		player1.ismoving = false;
		player2.ismoving = false;
		AIdest = canvas.height / 2 - paddleHeight / 2;
	}

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
						'player': 'player2',
						'y': player2.y,
					}));
				}
				else if (gamesocket)
				{
					gamesocket.send(JSON.stringify({
						'message': 'move',
						'player': 'player1',
						'y': player1.y,
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
					if (pongtournamentsocket && doubleia === 0)
					{
						pongtournamentsocket.send(JSON.stringify({
							'message': 'move',
							'player': await getUserName(),
							'y': beplayer === player1 ? player1.y : player2.y,
						}));
					}
					else if (pongtournamentsocket && doubleia === 1 && is_host === true)
					{
						pongtournamentsocket.send(JSON.stringify({
							'message': 'move',
							'player': "player1",
							'bally': ball.y,
							'ballx': ball.x,
							'y': player1.y,
						}));
						pongtournamentsocket.send(JSON.stringify({
							'message': 'move',
							'player': "player2",
							'bally': ball.y,
							'ballx': ball.x,
							'y': player2.y,
						}));
					}
				}, 1000 / 20);
			}
		}
	}
	
	function startPong()
	{
		if (start === 1)
			return ;
		initvariables();
		countdown();
		start = 1;
		if (iaisactive === 1 && start === 1 && is_host === true)
		{
			if (doubleia === 0 && gamemode === "solo")
			{
				fetch('/games/local-ia-start/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content')
					},
					body: JSON.stringify({
						'type' : 'Pong 1v1 IA',
						'started_at': Date.now(),
					})
				})
				.then(response => response.json())
				.then(data => {
					gameId = data.id;
				})
			}
			setTimeout(() => {
				interval = setInterval(updateAI, 1000);
			}, 5000);
		}
		if ((gamemode === "online" || gamemode === "online_tournament") && start === 1)
			setTimeout(sendmove, 5000);
		setTimeout(loop, 5000);
	}
	
	function startOption()
	{
		if (option === 1 || start === 1)
			return ;
		option = 1;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.backgroundcolor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		functionstochangeoption[optionindex](colorset.fontcolor);
	}
	
	function wait()
	{
		if (start === 1 || option === 1)
			return ;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.backgroundcolor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = colorset.fontcolor;
		context.font = "50px Arial";
		if (gamemode === "online_tournament")
			context.fillText("Waiting for player...", canvas.width / 2 - sizeofstringdisplayed("Waiting for player...").width / 2, canvas.height / 2);
		else
			context.fillText("Press red button to start", canvas.width / 2 - sizeofstringdisplayed("Press red button to start").width / 2, canvas.height / 2);
		context.font = "30px Arial";
		context.fillText("Press blue button for options", canvas.width / 2 - sizeofstringdisplayed("Press blue button for options").width / 2, canvas.height - 10);
	}

	async function sendInvite(event)
	{
		if (event.key === "Enter")
		{
			let playername = inviteinput.value;
			if (await checkPlayer(playername))
			{
				if (gamesocket == undefined)
					gamesocket = new WebSocket(`${wsProtocol}//${window.location.host}/ws/pong/`);
				inviteinput.style.display = "none";
				divofbox.style.display = "block";
				putnameinbox(await getUserName());

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
						putnameinbox(data.message.split(' ')[0]);
					else if (data.message === 'start')
						startPong();
					else if (data.message.includes('move'))
					{
						if (data.player === 'player1')
							player1.y = data.y;
						else if (data.player === 'player2')
							player2.y = data.y;
					}
				}
			
				gamesocket.onopen = function(event)
				{
					console.log('websocket open on pong');
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

	if (gamemode === "online" && joinagame)
	{
		// is_host = false;
		if (bebousocket == undefined)
			bebousocket = new WebSocket(`${wsProtocol}//${window.location.host}/ws/pong/`)
		beplayer = player2;
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
				beplayer = player1;
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
				startPong();
			else if (data.message.includes('move'))
			{
				if (data.player === 'player1')
					player1.y = data.y;
				else if (data.player === 'player2')
					player2.y = data.y;
				if (data.ballx && data.bally)
				{
					ball.x = data.ballx;
					ball.y = data.bally;
				}
			}
			else if (data.message === 'point')
			{
				score1 = data.score1;
				score2 = data.score2;
				if (score1 === 5 || score2 === 5)
				{
					clearendgame();
					start = 0;
					setTimeout(wait, 2000);
				}
			}
		}
	}

	wait();

	if (gamemode === "online")
		{
			redbutton.addEventListener("click", () =>
			{
				if (start === 0)
				{
					if (gamesocket && gamesocket.readyState === WebSocket.OPEN)
					{
						gamesocket.send(JSON.stringify({
							'message': 'start',
						}));
						fetch('/games/pong_online/', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content')
							},
							body: JSON.stringify({
								'type' : 'Pong 1v1',
								'started_at': Date.now(),
								'ended_at': null,
								'player1': divofbox.childNodes[0].textContent,
								'player2': divofbox.childNodes[1].textContent,
							})
						})
						.then(async response => await response.json())
						.then(data => {
							console.log(data.id);
							gameId = data.id;
						})
					}
					else if (bebousocket)
					{
						bebousocket.send(JSON.stringify({
							'message': 'start',
						}));
						fetch('/games/pong_online/', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content')
							},
							body: JSON.stringify({
								'type' : 'Pong 1v1',
								'started_at': Date.now(),
								'ended_at': null,
								'player1': divofbox.childNodes[0].textContent,
								'player2': divofbox.childNodes[1].textContent,
							})
						})
						.then(async response => await response.json())
						.then(data => {
							console.log(data.id);
							gameId = data.id;
						})
					}
				}
			});
		}
		else
			redbutton.addEventListener("click", startPong);
		bluebutton.addEventListener("click", startOption);
		inviteinput.addEventListener("keypress", sendInvite);
}

export { loadPong }
