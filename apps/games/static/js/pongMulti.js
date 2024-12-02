function loadPongMulti(){
	let interval = null;
	const canvas = document.getElementById('pong');
	const context = canvas.getContext('2d');
	const redbutton = document.getElementById('red');
	
	let speed = 10;
	let start = 0;
	const paddleHeight = 50;
	const paddleWidth = 5;

	//color
	const colorpalette = { white: "#FFFFFF", black: "#000000", red: "#FF0000", green: "#00FF00", blue: "#0000FF", yellow: "#FFFF00", cyan: "#00FFFF", magenta: "#FF00FF", silver: "#C0C0C0", gray: "#808080", maroon: "#800000", olive: "#808000", purple: "#800080", teal: "#008080", navy: "#000080", orange: "#FFA500", lime: "#00FF00", aqua: "#00FFFF", fuchsia: "#FF00FF", brown: "#A52A2A", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", purple: "#800080", red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", teal: "#008080", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32" };

	class point
	{
		equal(A, B)
		{
			if (A.x === B.x && A.y === B.y)
				return (true);
			return (false);
		}

		unequal(A, B)
		{
			if (A.x !== B.x || A.y !== B.y)
				return (true);
			return (false);
		}

		inferior(A, B)
		{
			if (A.x < B.x && A.y < B.y)
				return (true);
			return (false);
		}

		superior(A, B)
		{
			if (A.x > B.x && A.y > B.y)
				return (true);
			return (false);
		}

		inferiorequal(A, B)
		{
			if (A.x <= B.x && A.y <= B.y)
				return (true);
			return (false);
		}

		superiorequal(A, B)
		{
			if (A.x >= B.x && A.y >= B.y)
				return (true);
			return (false);
		}

		constructor(x, y)
		{
			this.x = x;
			this.y = y;
		}
	}

	const colorset =
	{
		fontcolor: colorpalette.white,
		backgroundcolor: colorpalette.black,
		ballcolor: colorpalette.white,
		team1: colorpalette.red,
		team2: colorpalette.blue,
		netcolor: colorpalette.white,
		scorecolor: colorpalette.white,
	};

	function drawRect(x, y, width, height, color)
	{
		context.fillStyle = color;
		context.fillRect(x, y, width, height);
	}

	function drawtriangle(context, point1, point2, point3, color)
	{
		context.fillStyle = color;
		context.beginPath();
		context.moveTo(point1.x, point1.y);
		context.lineTo(point2.x, point2.y);
		context.lineTo(point3.x, point3.y);
		context.closePath();
		context.fill();
	}

	function drawCircle(x, y, radius, color)
	{
		context.fillStyle = color;
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.closePath();
		context.fill();
	}

	function drawdiamond(context, x, y, width, height, color)
	{
		context.fillStyle = color;

		context.beginPath();
		context.moveTo(x + width / 2, y);
		context.lineTo(x + width, y + height / 2);
		context.lineTo(x + width / 2, y + height);
		context.lineTo(x, y + height / 2);
		context.closePath();
		context.fill();
	}


	function drawdiamondstroke(context, x, y, width, height, color)
	{
		context.lineWidth = 5;
		context.fillStyle = color;

		A = new point(x + 50, y + 50);
		B = new point(x + 50, y + height / 2);
		C = new point(x + width / 2, y + 50);

		drawtriangle(context, A, B, C, color);

		A.x = x - 50;
		B.x = x - 50;
		C.x = x - width / 2;

		drawtriangle(context, A, B, C, color);

		A.y = y - 50;
		B.y = y - height / 2;
		C.y = y - 50;

		drawtriangle(context, A, B, C, color);

		A.x = x + 50;
		B.x = x + 50;
		C.x = x + width / 2;

		drawtriangle(context, A, B, C, color);
	}

	function sizeofstringdisplayed(string)
	{
		return (context.measureText(string));
	}

	function hitboxcollision(hitbox1, hitbox2)
	{
		if (hitbox1.length === 4 && hitbox2.length === 4)
		{
			const A1 = hitbox1[0], B1 = hitbox1[1], C1 = hitbox1[2], D1 = hitbox1[3];
			const A2 = hitbox2[0], B2 = hitbox2[1], C2 = hitbox2[2], D2 = hitbox2[3];
		
			// Vérifier les collisions avec le système d'axes alignés (AABB)
			if (A1.x < C2.x && C1.x > A2.x && A1.y < C2.y && C1.y > A2.y)
			{
				collisionpoint = new point((A1.x + C1.x) / 2, (A1.y + C1.y) / 2);
				return collisionpoint;
			}
			return 0;
		}
		else if (hitbox1.length === 3 && hitbox2.length === 3)
		{
			const A1 = hitbox1[0], B1 = hitbox1[1], C1 = hitbox1[2];
			const A2 = hitbox2[0], B2 = hitbox2[1], C2 = hitbox2[2];
		
			// Vérifier les collisions avec le système d'axes alignés (AABB)
			if (A1.x < C2.x && C1.x > A2.x && A1.y < C2.y && C1.y > A2.y)
			{
				collisionpoint = new point((A1.x + C1.x) / 2, (A1.y + C1.y) / 2);
				return collisionpoint;
			}
			return 0;
		}
	}

	// Joueurs
	class Player
	{
		update()
		{
			this.y += this.dy;
			this.hitbox = [
				new point(this.x, this.y),
				new point(this.x + this.width, this.y),
				new point(this.x + this.width, this.y + this.height),
				new point(this.x, this.y + this.height),
			]
		}

		draw()
		{
			drawRect(this.x, this.y, this.width, this.height, this.color);
		}

		constructor(x, y, width, height, color, team) {
			this.x = x;
			this.y = y;
			this.dx = 0;
			this.dy = 0;
			this.width = width;
			this.height = height;
			this.color = color;
			this.score = 0;
			this.speed = speed;
			this.hitbox = [
				new point(this.x, this.y),
				new point(this.x + this.width, this.y),
				new point(this.x + this.width, this.y + this.height),
				new point(this.x, this.y + this.height),
			]
			this.up = false;
			this.down = false;
			team = team;
		}
	}

	// Balle
	class Ball
	{
		backgroundballcollision(background, ball)
		{
			const allcollision = [
				hitboxcollision(background.exteriorwall.walltop, ball.hitbox),
				hitboxcollision(background.exteriorwall.wallbottom, ball.hitbox),
				hitboxcollision(background.exteriorwall.wallleft, ball.hitbox),
				hitboxcollision(background.exteriorwall.wallright, ball.hitbox),
				hitboxcollision(background.exteriorwall.walltopleft, ball.hitbox),
				hitboxcollision(background.exteriorwall.walltopright, ball.hitbox),
				hitboxcollision(background.exteriorwall.wallbottomleft, ball.hitbox),
				hitboxcollision(background.exteriorwall.wallbottomright, ball.hitbox),
				hitboxcollision(background.diamondcentral, ball.hitbox),
				hitboxcollision(background.centraldiamondstroke.topleft, ball.hitbox),
				hitboxcollision(background.centraldiamondstroke.topright, ball.hitbox),
				hitboxcollision(background.centraldiamondstroke.bottomleft, ball.hitbox),
				hitboxcollision(background.centraldiamondstroke.bottomright, ball.hitbox),
			];
			let collisionpoint = undefined;
			for (let i = 0; i < allcollision.length; i++)
			{
				if (allcollision[i] !== 0)
				{
					collisionpoint = allcollision[i];
					break ;
				}
			}
			if (collisionpoint !== undefined)
			{
				console.log(collisionpoint);
				ball.x = collisionpoint.x;
				ball.y = collisionpoint.y;
				ball.dx = -ball.dx;
				ball.dy = -ball.dy * Math.random();
				return (true);
			}

		}

		playerballcollision(player, ball)
		{
			if (hitboxcollision(player.hitbox, ball.hitbox))
			{
				return (true);
			}
		}

		ballcollision(background, player1, player2, player3, player4, ball)
		{
			return (
				this.backgroundballcollision(background, ball) ||
				this.playerballcollision(player1, ball) ||
				this.playerballcollision(player2, ball) ||
				this.playerballcollision(player3, ball) ||
				this.playerballcollision(player4, ball)
			);
		}

		update(background, player1, player2, player3, player4, ball)
		{
			ball.x += ball.dx * ball.speed;
			ball.y += ball.dy * ball.speed;
			ball.hitbox = [
				new point(ball.x - ball.radius, ball.y - ball.radius),
				new point(ball.x + ball.radius, ball.y - ball.radius),
				new point(ball.x + ball.radius, ball.y + ball.radius),
				new point(ball.x - ball.radius, ball.y + ball.radius),
			]
			if (this.ballcollision(background, player1, player2, player3, player4, ball))
			{
				console.log("collision");
				ball.speed += 0.2;
				// ball.dx = -ball.dx;
				// ball.dy = -ball.dy * Math.random();
				console.log(ball.dx, ball.dy);
				console.log(ball.speed);
			}
		}

		draw()
		{
			drawCircle(this.x, this.y, this.radius, this.color);
		}

		constructor(x, y, dx, dy, radius, color, speed)
		{
			this.x = x;
			this.y = y;
			this.dx = dx;
			this.dy = dx;
			this.radius = radius;
			this.color = color;
			this.speed = speed;
			this.hitbox = [
				new point(this.x - this.radius, this.y - this.radius),
				new point(this.x + this.radius, this.y - this.radius),
				new point(this.x + this.radius, this.y + this.radius),
				new point(this.x - this.radius, this.y + this.radius),
			]
		}
	}

	class background
	{
		drawset(canvas, context, colorset)
		{
			const crossWidth = canvas.width - 10;
			const crossHeight = canvas.height - 10;
			const borderThickness = canvas.width * 0.5;
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			context.strokeStyle = colorset.netcolor;
			context.lineWidth = 5;

			// Rectangle horizontal
			context.strokeRect(
				centerX - crossWidth / 2,
				centerY - borderThickness / 2,  
				crossWidth,                     
				borderThickness                 
			);

			// Rectangle vertical
			context.strokeRect(
				centerX - borderThickness / 2,  
				centerY - crossHeight / 2,      
				borderThickness,                
				crossHeight                     
			);

			// supression des bordures interieures
			context.fillStyle = colorset.backgroundcolor;
			context.fillRect(centerX - crossWidth / 2, centerY - borderThickness / 2, crossWidth, borderThickness);
			context.fillRect(centerX - borderThickness / 2, centerY - crossHeight / 2, borderThickness, crossHeight);

			// losange central coupe en 4
			drawdiamondstroke(context, centerX, centerY, borderThickness, borderThickness, colorset.netcolor);

			// losange central
			drawdiamond(context, centerX - 25, centerY - 25, 50, 50, colorset.netcolor);
		}

		draw()
		{
			context.fillStyle = colorset.backgroundcolor;
			context.fillRect(0, 0, canvas.width, canvas.height);
			this.drawset(canvas, context, colorset);
		}

		drawrectangularhitbox(A, B, C, D, color)
		{
			context.strokeStyle = color;
			context.lineWidth = 1;
			
			context.beginPath();
			context.moveTo(A.x, A.y);
			context.lineTo(B.x, B.y);
			context.lineTo(C.x, C.y);
			context.lineTo(D.x, D.y);
			context.closePath();
			context.stroke();
		}

		drawtrianglehitbox(A, B, C, color)
		{
			context.strokeStyle = color;
			context.lineWidth = 1;

			context.beginPath();
			context.moveTo(A.x, A.y);
			context.lineTo(B.x, B.y);
			context.lineTo(C.x, C.y);
			context.closePath();
			context.stroke();
		}

		drawhitbox()
		{
			context.strokeStyle = "red";
			context.lineWidth = 1;

			this.drawrectangularhitbox(this.exteriorwall.walltop[0], this.exteriorwall.walltop[1], this.exteriorwall.walltop[2], this.exteriorwall.walltop[3], "red");
			this.drawrectangularhitbox(this.exteriorwall.wallbottom[0], this.exteriorwall.wallbottom[1], this.exteriorwall.wallbottom[2], this.exteriorwall.wallbottom[3], "red");
			this.drawrectangularhitbox(this.exteriorwall.wallleft[0], this.exteriorwall.wallleft[1], this.exteriorwall.wallleft[2], this.exteriorwall.wallleft[3], "red");
			this.drawrectangularhitbox(this.exteriorwall.wallright[0], this.exteriorwall.wallright[1], this.exteriorwall.wallright[2], this.exteriorwall.wallright[3], "red");
			this.drawrectangularhitbox(this.exteriorwall.walltopleft[0], this.exteriorwall.walltopleft[1], this.exteriorwall.walltopleft[2], this.exteriorwall.walltopleft[3], "red");
			this.drawrectangularhitbox(this.exteriorwall.walltopright[0], this.exteriorwall.walltopright[1], this.exteriorwall.walltopright[2], this.exteriorwall.walltopright[3], "red");
			this.drawrectangularhitbox(this.exteriorwall.wallbottomleft[0], this.exteriorwall.wallbottomleft[1], this.exteriorwall.wallbottomleft[2], this.exteriorwall.wallbottomleft[3], "red");
			this.drawrectangularhitbox(this.exteriorwall.wallbottomright[0], this.exteriorwall.wallbottomright[1], this.exteriorwall.wallbottomright[2], this.exteriorwall.wallbottomright[3], "red");
			this.drawrectangularhitbox(this.diamondcentral[0], this.diamondcentral[1], this.diamondcentral[2], this.diamondcentral[3], "red");
			this.drawtrianglehitbox(this.centraldiamondstroke.topleft[0], this.centraldiamondstroke.topleft[1], this.centraldiamondstroke.topleft[2], "red");
			this.drawtrianglehitbox(this.centraldiamondstroke.topright[0], this.centraldiamondstroke.topright[1], this.centraldiamondstroke.topright[2], "red");
			this.drawtrianglehitbox(this.centraldiamondstroke.bottomleft[0], this.centraldiamondstroke.bottomleft[1], this.centraldiamondstroke.bottomleft[2], "red");
			this.drawtrianglehitbox(this.centraldiamondstroke.bottomright[0], this.centraldiamondstroke.bottomright[1], this.centraldiamondstroke.bottomright[2], "red");
		}

		constructor(x, y, width, height, color)
		{
			const borderThickness = canvas.width * 0.5;

			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.color = color;
			this.exteriorwall =
			{
				walltop: [
					new point(canvas.width / 2 - borderThickness / 2, 0),
					new point(canvas.width / 2 - borderThickness / 2, 5),
					new point(canvas.width / 2 + borderThickness / 2, 5),
					new point(canvas.width / 2 + borderThickness / 2, 0),
				],
				wallbottom: [
					new point(canvas.width / 2 - borderThickness / 2, canvas.height),
					new point(canvas.width / 2 - borderThickness / 2, canvas.height - 5),
					new point(canvas.width / 2 + borderThickness / 2, canvas.height - 5),
					new point(canvas.width / 2 + borderThickness / 2, canvas.height),
				],
				wallleft: [
					new point(0, canvas.height / 2 - borderThickness / 2),
					new point(5, canvas.height / 2 - borderThickness / 2),
					new point(5, canvas.height / 2 + borderThickness / 2),
					new point(0, canvas.height / 2 + borderThickness / 2),
				],
				wallright: [
					new point(canvas.width, canvas.height / 2 - borderThickness / 2),
					new point(canvas.width - 5, canvas.height / 2 - borderThickness / 2),
					new point(canvas.width - 5, canvas.height / 2 + borderThickness / 2),
					new point(canvas.width, canvas.height / 2 + borderThickness / 2),
				],
				walltopleft: [
					new point(0, 0),
					new point(canvas.width / 2 - borderThickness / 2, 0),
					new point(canvas.width / 2 - borderThickness / 2, borderThickness / 2),
					new point(0, borderThickness / 2),
				],
				walltopright: [
					new point(canvas.width / 2 + borderThickness / 2, 0),
					new point(canvas.width, 0),
					new point(canvas.width, borderThickness / 2),
					new point(canvas.width / 2 + borderThickness / 2, borderThickness / 2),
				],
				wallbottomleft: [
					new point(0, canvas.height),
					new point(canvas.width / 2 - borderThickness / 2, canvas.height),
					new point(canvas.width / 2 - borderThickness / 2, canvas.height - borderThickness / 2),
					new point(0, canvas.height - borderThickness / 2),
				],
				wallbottomright: [
					new point(canvas.width / 2 + borderThickness / 2, canvas.height),
					new point(canvas.width, canvas.height),
					new point(canvas.width, canvas.height - borderThickness / 2),
					new point(canvas.width / 2 + borderThickness / 2, canvas.height - borderThickness / 2),
				],
			};
			this.diamondcentral =
			[
				new point(canvas.width / 2 + 25, canvas.height / 2),
				new point(canvas.width / 2, canvas.height / 2 - 25),
				new point(canvas.width / 2 - 25, canvas.height / 2),
				new point(canvas.width / 2, canvas.height / 2 + 25),
			];

			this.centraldiamondstroke =
			{
				topleft: [
					new point(canvas.width / 2 - 50, canvas.height / 2 - 50),
					new point(canvas.width / 2 - borderThickness / 7, canvas.height / 2 - borderThickness / 2),
					new point(canvas.width / 2 - borderThickness / 2, canvas.height / 2 - borderThickness / 7),
				],
				topright: [
					new point(canvas.width / 2 + 50, canvas.height / 2 - 50),
					new point(canvas.width / 2 + borderThickness / 7, canvas.height / 2 - borderThickness / 2),
					new point(canvas.width / 2 + borderThickness / 2, canvas.height / 2 - borderThickness / 7),
				],
				bottomleft: [
					new point(canvas.width / 2 - 50, canvas.height / 2 + 50),
					new point(canvas.width / 2 - borderThickness / 7, canvas.height / 2 + borderThickness / 2),
					new point(canvas.width / 2 - borderThickness / 2, canvas.height / 2 + borderThickness / 7),
				],
				bottomright: [
					new point(canvas.width / 2 + 50, canvas.height / 2 + 50),
					new point(canvas.width / 2 + borderThickness / 7, canvas.height / 2 + borderThickness / 2),
					new point(canvas.width / 2 + borderThickness / 2, canvas.height / 2 + borderThickness / 7),
				],
			};

		}
	}

	/*t_game*/
	var t_game = {
		player1: new Player(0, canvas.height / 2 - 50, 10, 100, colorset.team1, 1),
		player2: new Player(canvas.width - 10, canvas.height / 2 - 50, 10, 100, colorset.team2, 2),
		player3: new Player(0, canvas.height / 2 - 50, 10, 100, colorset.team1, 1),
		player4: new Player(canvas.width - 10, canvas.height / 2 - 50, 10, 100, colorset.team2, 2),
		ball: new Ball(canvas.width / 2, canvas.height / 2, 0, 0, 5, colorset.ballcolor, speed),
		background: new background(0, 0, canvas.width, canvas.height, colorset.backgroundcolor),
	};
	
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
	/* Draw */
	
	function draw()
	{
		t_game.background.draw();
		// t_game.background.drawhitbox();
		t_game.player1.draw();
		t_game.player2.draw();
		t_game.player3.draw();
		t_game.player4.draw();
		t_game.ball.draw();
	}

	function update()
	{
		t_game.player1.update();
		t_game.player2.update();
		t_game.player3.update();
		t_game.player4.update();
		t_game.ball.update(t_game.background, t_game.player1, t_game.player2, t_game.player3, t_game.player4, t_game.ball);
	}
	
	function keyhookdownforgame(event)
	{
	}
	
	/* Mouvement des raquettes */
	document.addEventListener("keydown", (event) =>
	{

	});
	
	function keyhookupforgame(event)
	{
	}
	
	document.body.addEventListener("keyup", (event) =>
	{
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
		t_game.player1 = new Player(paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, colorset.team1, 1);
		t_game.player2 = new Player(canvas.width - paddleWidth * 2, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, colorset.team1, 1);
		t_game.player3 = new Player(canvas.width / 2 - paddleHeight / 2, paddleWidth, paddleHeight, paddleWidth, colorset.team2, 2);
		t_game.player4 = new Player(canvas.width / 2 - paddleHeight / 2, canvas.height - paddleWidth * 2, paddleHeight, paddleWidth, colorset.team2, 2);
		ballplassement = new point(0, 0);
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
			t_game.ball.dx = Math.random();
		else if (ballplassement.x === 50)
			t_game.ball.dx = 1;
		else
			t_game.ball.dx = -1;
		if (ballplassement.y === 0)
			t_game.ball.dy = Math.random();
		else if (ballplassement.y === 50)
			t_game.ball.dy = 1;
		else
			t_game.ball.dy = -1;
		t_game.background = new background(0, 0, canvas.width, canvas.height, colorset.backgroundcolor);
		start = 1;
	}
	
	function startPong()
	{
		if (start === 1)
			return ;
		// countdown();
		initvariables();
		// setTimeout(loop, 5000);
		loop();
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
		context.fillText("Press red button to start", canvas.width / 2 - sizeofstringdisplayed("Press red button to start").width / 2, canvas.height / 2);
	}
	
	wait();
	redbutton.addEventListener("click", startPong);
}

export { loadPongMulti }