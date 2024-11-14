import { draw } from "./spacedraw.js";
import { update } from "./spaceupdate.js";

document.addEventListener('DOMContentLoaded', function() {
	const canvas = document.getElementById('space-invadeur');
	const context = canvas.getContext('2d');
	const redButton = document.getElementById('redButton');
	
	const player = { x: context.canvas.width / 2 - 50 , y: context.canvas.height - 50, width: 75, height: 10, dx: 0, dy: 0, speed: 2, left: 0, right: 0, life: 3};

	let start = 0;

	const modeleAlien1 = [
		[0, 0, 1, 0, 0],
		[0, 1, 1, 1, 0],
		[1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1],
		[1, 0, 1, 0, 1],
	];
	
	const modeleAlien2 = [
		[0, 1, 0, 1, 0],
		[1, 0, 1, 0, 1],
		[1, 1, 1, 1, 1],
		[1, 0, 0, 0, 1],
		[0, 1, 1, 1, 0],
	];
	
	const modeleAlien3 = [
		[0, 1, 0, 1, 0],
		[1, 0, 1, 0, 1],
		[1, 1, 1, 1, 1],
		[1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0],
	];
	
	const allAlien = [modeleAlien1, modeleAlien2, modeleAlien3];

	class Alien
	{
		constructor(x, y, width, height, dx, dy, speed, shoot, dead, modele, coordonnees)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.dx = dx;
			this.dy = dy;
			this.speed = speed;
			this.shoot = shoot;
			this.dead = dead;
			this.modele = modele;
			this.coordonnees = [];
		}
	}
	
	class Bullet
	{
		constructor(x, y, width, height, dx, dy, speed, shoot, isbulletplayer)
		{
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.dx = dx;
			this.dy = dy;
			this.speed = speed;
			this.shoot = shoot;
			this.isbulletplayer = isbulletplayer;
		}
	}
	
	/*variables*/
	let column = 10;
	let row = 4;
	let aliens = [];
	for (let i = 0; i < row; i++)
	{
		let alien = [];
		for (let j = 0; j < column; j++)
		{
			let modele = allAlien[i % 3];
			alien.push(new Alien(j * context.canvas.width / column, i * context.canvas.height * 0.1, 10, 10, 1, 0, 1, 0, 0, modele, [j, i]));
		}
		aliens.push(alien);
	}
	let bullets = [];
	// let colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
	let score = {value: 0};
	let colorset = 0;
	/*variables*/

	function isabulletplayer(bullets)
	{
		let i = 0;
		while (i < bullets.length)
		{
			if (bullets[i].isbulletplayer === 1)
				return (1);
			i++;
		}
		return (0);
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
		else if (event.key === " " && isabulletplayer(bullets) === 0)
		{
			bullets.push(new Bullet(player.x + player.width / 2, player.y, 5, 5, 0, -1, 5, 1, 1));
			
		}
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
	
	function gameloop()
	{
		if (start === 0)
			return ;
		start = 1;
		if (update(player, aliens, bullets, canvas, context, score) === 0)
			return ;
		draw(canvas, context, player, aliens, bullets, score, colorset);
		requestAnimationFrame(gameloop);
	}
	
	// function countdown()
	// {
	// 	context.fillStyle = "white";
	// 	context.font = "30px Arial";
	// 	context.fillText("3", canvas.width / 2 - 10, canvas.height / 2);
	// 	setTimeout(function() {
	// 		context.clearRect(0, 0, canvas.width, canvas.height);
	// 		context.fillText("2", canvas.width / 2 - 10, canvas.height / 2);
	// 	}, 1000);
	// 	setTimeout(function() {
	// 		context.clearRect(0, 0, canvas.width, canvas.height);
	// 		context.fillText("1", canvas.width / 2 - 10, canvas.height / 2);
	// 	}, 2000);
	// 	setTimeout(function() {
	// 		context.clearRect(0, 0, canvas.width, canvas.height);
	// 		context.fillText("GO", canvas.width / 2 - 20, canvas.height / 2);
	// 	}, 3000);
	// }

	function startGame()
	{
		// countdown();
		// setTimeout(gameloop, 3000);
		if (start === 1)
			return ;
		start = 1;
		gameloop();
	}
	
	function wait()
	{
		context.fillStyle = "#FFF";
		context.font = "50px Arial";
		context.fillText("Press red button to start", canvas.width / 2 - 250, canvas.height / 2);
	}
	
	wait();

	redButton.addEventListener('click', startGame);
});


