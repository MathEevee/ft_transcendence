function loadPong() {
	let interval = null;
	const canvas = document.getElementById('pong');
	const context = canvas.getContext('2d');
	const redbutton = document.getElementById('red');
	const bluebutton = document.getElementById('blue');
	const chatbox = document.getElementById('box');
	chatbox.style.display = "none";
	
	// Joueurs
	const paddleWidth = 10;
	const paddleHeight = 100;
	const player1 = { x: 0, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0, ismoving: false};
	const player2 = { x: canvas.width - paddleWidth, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, dy: 0 , ismoving: false};
	
	// Gamemode
	var gamemode = "";
	if (window.location.pathname === "/games/pong/local/")
		gamemode = "local";
	else if (window.location.pathname === "/games/pong/solo/")
		gamemode = "solo";
	else if (window.location.pathname === "/games/pong/multiplayer/")
		gamemode = "multiplayer";

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
	let gameId;
	
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
	
	
	function keyhookdownforgame(event)
	{
		if (event.key === "ArrowUp" && player2.up !== 1 && gamemode === "local")
		{
			player2.up = 1;
			player2.dy += -speed;
		}
		else if (event.key === "ArrowDown" && player2.down !== 1 && gamemode === "local")
		{
			player2.down = 1;
			player2.dy += speed;
		}
		else if ((event.key === "z" || event.key === "w") && player1.up !== 1)
		{
			player1.up = 1;
			player1.dy += -speed;
		}
		else if (event.key === "s" && player1.down !== 1)
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
		if (chatbox.style.display !== "none")
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
		if (event.key === "ArrowUp" && player2.up === 1 && gamemode === "local")
		{
			player2.up = 0;
			player2.dy -= -speed;
		}
		else if (event.key === "ArrowDown" && player2.down === 1 && gamemode === "local")
		{
			player2.down = 0;
			player2.dy -= speed;
		}
		else if ((event.key === "z" || event.key === "w") && player1.up === 1)
		{
			player1.up = 0;
			player1.dy -= -speed;
		}
		else if (event.key === "s" && player1.down === 1)
		{
			player1.down = 0;
			player1.dy -= speed;
		}
	}
	
	document.body.addEventListener("keyup", (event) =>
	{
		if (chatbox.style.display !== "none")
			return ;
		if (event.key === "r")
			startPong();
		else if (event.key === "b")
			startOption();
		else if (event.key === "o" || event.key === "O")
			toggleFullscreen(canvas);
		if (start === 1)
			keyhookupforgame(event);
		else if (option === 1)
			keyhookupforoption(event);
	});
	
	function playerMove()
	{
		if (start === 0)
			return ;
		player1.y += player1.dy;
		player1.y = Math.max(Math.min(player1.y, canvas.height - paddleHeight), 0);
		if (gamemode === "local")
		{
			player2.y += player2.dy;
			player2.y = Math.max(Math.min(player2.y, canvas.height - paddleHeight), 0);
		}
		else if (gamemode === "solo")
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
			player2.y = Math.max(Math.min(player2.y, canvas.height - paddleHeight), 0);
		}

	}
	
	function ballMove()
	{
		ball.y += ball.dy * ball.speed;
		ball.x += ball.dx * ball.speed;
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
		if (ball.x < 0)
			score2++;
		else
		score1++;
		if (score1 === 5 || score2 === 5)
		{
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = colorset.backgroundcolor;
			context.fillRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = colorset.fontcolor;
			context.fillText(score1 === 5 ? "Player 1 wins!" : "Player 2 wins!", canvas.width / 2 - sizeofstringdisplayed(score1 === 5 ? "Player 1 wins!" : "Player 2 wins!").width / 2, canvas.height / 2);
			setTimeout(wait, 2000);
			//send end game score + set gameid = NULL 
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
				console.log(data);
				gameId = null;
			})
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
		let playerdest = player2.y;
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
		if (gamemode !== "solo" || start === 0)
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
		if (update())
			return 1;
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
	
	function startPong()
	{
		if (start === 1 || option === 1)
			return ;
		initvariables();
		countdown();
		start = 1;
		if (gamemode === "solo" && start === 1)
		{
			fetch('/games/local-ia-start/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': document.querySelector("[name=csrf_token]").getAttribute('content')
				},
				body: JSON.stringify({
					'type' : 'Pong 1v1',
					'started_at': Date.now(),
				})
			})
			.then(response => response.json())
			.then(data => {
				gameId = data.id;
			})
			setTimeout(() => {
				interval = setInterval(updateAI, 1000);
			}, 5000);
		}
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
		context.fillText("Press red button to start", canvas.width / 2 - sizeofstringdisplayed("Press red button to start").width / 2, canvas.height / 2);
		context.font = "30px Arial";
		context.fillText("Press blue button for options", canvas.width / 2 - sizeofstringdisplayed("Press blue button for options").width / 2, canvas.height - 10);
	}
	
	wait();
	redbutton.addEventListener("click", startPong);
	bluebutton.addEventListener("click", startOption);
}

export { loadPong }
