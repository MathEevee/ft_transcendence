import { Ball } from "/static/js/pongMulti/ball.js";
import { Player } from "/static/js/pongMulti/player.js";
import { background } from "/static/js/pongMulti/background.js";
import { point } from "/static/js/pongMulti/point.js";
import { sizeofstringdisplayed } from "/static/js/pongMulti/utils.js";

function loadPongMulti(){
	let interval = null;
	const canvas = document.getElementById('pong');
	const context = canvas.getContext('2d');
	const redbutton = document.getElementById('red');
	
	let speed = 12;
	let start = 0;
	const paddleHeight = 50;
	const paddleWidth = 5;

	const colorpalette = { white: "#FFFFFF", black: "#000000", red: "#FF0000", green: "#00FF00", blue: "#0000FF", yellow: "#FFFF00", cyan: "#00FFFF", magenta: "#FF00FF", silver: "#C0C0C0", gray: "#808080", maroon: "#800000", olive: "#808000", purple: "#800080", teal: "#008080", navy: "#000080", orange: "#FFA500", lime: "#00FF00", aqua: "#00FFFF", fuchsia: "#FF00FF", brown: "#A52A2A", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", purple: "#800080", red: "#FF0000", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", silver: "#C0C0C0", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", teal: "#008080", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", white: "#FFFFFF", whitesmoke: "#F5F5F5", yellow: "#FFFF00", yellowgreen: "#9ACD32" };

	const colorset =
	{
		fontcolor: colorpalette.white,
		backgroundcolor: colorpalette.black,
		ballcolor: colorpalette.cyan,
		team1: colorpalette.red,
		team2: colorpalette.blue,
		netcolor: colorpalette.white,
		scorecolor: colorpalette.white,
	};

	/*t_game*/
	var t_game = {
		player1: new Player(0, canvas.height / 2 - 50, 10, 100, colorset.team1, 1),
		player2: new Player(canvas.width - 10, canvas.height / 2 - 50, 10, 100, colorset.team2, 2),
		player3: new Player(0, canvas.height / 2 - 50, 10, 100, colorset.team1, 1),
		player4: new Player(canvas.width - 10, canvas.height / 2 - 50, 10, 100, colorset.team2, 2),
		ball: new Ball(canvas.width / 2, canvas.height / 2, 0, 0, 5, colorset.ballcolor, speed),
		background: new background(0, 0, canvas.width, canvas.height, colorset.backgroundcolor, canvas),
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
		t_game.background.draw(context, canvas, colorset);
		t_game.background.drawhitbox(context, colorset);
		t_game.player1.draw(context);
		t_game.player2.draw(context);
		t_game.player3.draw(context);
		t_game.player4.draw(context);
		t_game.ball.draw(context);
		// t_game.ball.drawhitbox(context);
	}

	function update()
	{
		t_game.player1.update();
		t_game.player2.update();
		t_game.player3.update();
		t_game.player4.update();
		t_game.ball.update(canvas, t_game.background, t_game.player1, t_game.player2, t_game.player3, t_game.player4, t_game.ball);
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
			t_game.ball.dx = -1;//Math.random() * 0.5;
		else if (ballplassement.x === 50)
			t_game.ball.dx = -1;
		else
			t_game.ball.dx = -1;
		if (ballplassement.y === 0)
			t_game.ball.dy = 1;//Math.random() * 0.5;
		else if (ballplassement.y === 50)
			t_game.ball.dy = 1;
		else
			t_game.ball.dy = -1;
		t_game.background = new background(0, 0, canvas.width, canvas.height, colorset.backgroundcolor, canvas);
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
		context.fillText("Press red button to start", canvas.width / 2 - sizeofstringdisplayed(context, "Press red button to start").width / 2, canvas.height / 2);
	}
	
	wait();
	redbutton.addEventListener("click", startPong);
}

export { loadPongMulti }