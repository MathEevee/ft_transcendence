function loadSpaceInvadersGame(){
	
	// document.addEventListener('DOMContentLoaded', function() {
		const canvas = document.getElementById('space-invadeur');
		const context = canvas.getContext('2d');
		const redButton = document.getElementById('redButton');
		
		const player =
		{
			x: context.canvas.width / 2 - 50,
			y: context.canvas.height - 50,
			width: 10,
			height: 10,
			dx: 0,
			dy: 0,
			speed: 2,
			left: 0,
			right: 0,
			life: 3,
			hitbox: 0,
		};
		
		let start = 1;
		
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
			constructor(x, y, width, height, dx, dy, speed, shoot, dead, modele)
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
				this.hitbox = [];
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
		const column = 10;
		const row = 4;
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
				bullets.push(new Bullet(player.x + (player.hitbox[2] - player.hitbox[0]) / 2 - 5, player.hitbox[1], 10, 10, 0, -1, 5, 1, 1));
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
			if (update(player, aliens, bullets, canvas, context, score))
				{
					start = 1;
					return (1);
				}
				draw(canvas, context, player, aliens, bullets, score, colorset);
				requestAnimationFrame(gameloop);
			}
			
			function countdown()
			{
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.fillStyle = "white";
				context.font = "50px Arial";
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

		function initvariables()
		{
			player.x = context.canvas.width / 2 - 50;
			player.y = context.canvas.height - 50;
			player.width = 10;
			player.height = 10;
			player.dx = 0;
			player.dy = 0;
			player.speed = 2;
			player.left = 0;
			player.right = 0;
			player.life = 3;
			player.hitbox = 0;
			aliens = [];
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
			bullets = [];
			score.value = 0;
			colorset = 0;
		}

		function startGame()
		{
			countdown();
			if (start === 0)
				return ;
			initvariables();
			start = 0;
			setTimeout(gameloop, 3000);

		}

		function wait()
		{
			context.fillStyle = "#FFF";
			context.font = "50px Arial";
			context.fillText("Press red button to start", canvas.width / 2 - 250, canvas.height / 2);
		}

		wait();
		
		redButton.addEventListener('click', startGame);

	/*update start*/
	let diralien = 1;
	let aleretour = 0;

	function updateplayer(player, canvas)
	{
		player.x += player.dx * player.speed;
		player.x = Math.max(Math.min(player.x, canvas.width - player.width), 0);

	}

	function aliensgodown(aliens, canvas)
	{
		let i = 0;
		while (i < aliens.length)
		{
			let j = 0;
			while (j < aliens[i].length)
			{
				aliens[i][j].y += canvas.height * 0.1;
				j++;
			}
			i++;
		}
		aleretour = 0;
	}

	function maxonline(aliens)
	{
		let i = 0;
		let max = 0;
		while (i < aliens.length)
		{
			if (aliens[i].length > max)
				max = aliens[i].length;
			i++;
		}
		return (max);
	}

	function updatealiens(aliens, canvas)
	{
		let i = 0;
		while (i < aliens.length)
		{
			let j = 0;
			while (j < aliens[i].length)
			{
				if (aliens[i][j].x + aliens[i][j].width > canvas.width && diralien === 1)
				{
					diralien *= -1;
					aleretour += 1;
				}
				else if (aliens[i][j].x < 0 && diralien === -1)
				{
					diralien *= -1;
					aleretour += 1;
				}
				aliens[i][j].x += aliens[i][j].speed * diralien;
				j++;
			}
			if (aleretour === maxonline(aliens))
				aliensgodown(aliens, canvas);
			i++;
		}
	}

	function alienisshot(bullet, aliens, score)
	{
		let i = 0;
		while (i < aliens.length)
		{
			let j = 0;
			while (j < aliens[i].length)
			{
				if (bullet.x > aliens[i][j].hitbox[0] && bullet.x < aliens[i][j].hitbox[2] && bullet.y > aliens[i][j].hitbox[1] && bullet.y < aliens[i][j].hitbox[3])
				{
					aliens[i].splice(j, 1);
					if (aliens[i].length === 0)
						aliens.splice(i, 1);
					return (1);
				}
				j++;
			}
			i++;
		}
		return (0);
	}

	function hitboxcollision(hitbox1, hitbox2)
	{
		if (hitbox1 == 0 || hitbox1 === undefined)
			return (false);
		const [x1, y1, x2, y2] = hitbox1;
		const [x3, y3, x4, y4] = hitbox2;
		if (x1 < x4 && x2 > x3 && y1 < y4 && y2 > y3)
			return (true);
		return (false);
	}

	function playertouchalien(player, aliens)
	{
		let i = 0;

		while (i < aliens.length)
		{
			let j = 0;
			while (j < aliens[i].length)
			{
				if(hitboxcollision(player.hitbox, aliens[i][j].hitbox))
					return (1);
				j++;
			}
			i++;
		}
		return (0);
	}

	function alienonearth(aliens, canvas)
	{
		let i = 0;
		while (i < aliens.length)
		{
			let j = 0;
			while (j < aliens[i].length)
			{
				if (aliens[i][j].hitbox[3] > canvas.height)
					return (1);
				j++;
			}
			i++;
		}
	}

	function prinsmg(context, text, x, y)
	{
		context.fillStyle = "white";
		context.font = "30px Arial";
		context.fillText(text, x, y);
	}

	function gamefinished(aliens, player, canvas, context)
	{
		if (aliens.length === 0)
		{
			context.clearRect(0, 0, canvas.width, canvas.height);
			prinsmg(context, "YOU WIN", canvas.width / 2 - 100, canvas.height / 2);
			return (1);
		}
		if (player.lives === 0 || playertouchalien(player, aliens) === 1 || alienonearth(aliens, canvas) === 1)
		{
			context.clearRect(0, 0, canvas.width, canvas.height);
			prinsmg(context, "GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
			return (1);
		}
		return (0);
	}

	function updatebullets(bullets, canvas, context, aliens, score)
	{
		let i = 0;
		while (i < bullets.length)
		{
			bullets[i].y += bullets[i].dy * bullets[i].speed;
			if (bullets[i].y < canvas.height * 0.1 + 20) 
				bullets.splice(i, 1);
			else if (alienisshot(bullets[i], aliens, score) === 1)
			{
				bullets.splice(i, 1);
				score.value += 100;
			}
			i++;
		}
	}

	function update(player, aliens, bullets, canvas, context, score)
	{
		if (gamefinished(aliens, player, canvas, context) === 1)
		{
			return (1);
		}
		updateplayer(player, canvas);
		updatealiens(aliens, canvas);
		if (bullets.length > 0)
			updatebullets(bullets, canvas, context, aliens, score);
	}
	/*end update*/


	/*start draw*/
	const modeleCanon = [
		[0, 0, 0, 1, 1, 1, 0, 0, 0],
		[0, 0, 1, 1, 1, 1, 1, 0, 0],
		[0, 1, 1, 1, 1, 1, 1, 1, 0],
		[1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 0, 0, 0, 1, 1, 1],
	];

	const modeleheart = [
		[0, 1, 0, 1, 0],
		[1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1],
		[0, 1, 1, 1, 0],
		[0, 0, 1, 0, 0],
	];

	function drawlife(context, player, canvas)
	{
		let i = 0;
		let x = canvas.width - 180;
		let y = canvas.height * 0.1 - 70;
		let width = 10;
		let height = 10;
		while (i < player.life)
			{
				let j = 0;
				while (j < modeleheart.length)
					{
						let k = 0;
						while (k < modeleheart[j].length)
							{
								if (modeleheart[j][k] === 1)
									{
										context.fillStyle = "red";
										context.fillRect(x + k * width, y + j * height, width, height);
									}
							k++;
						}
						j++;
					}
					x += 60;
					i++;
				}
			}

			function drawplayer(canvas, context, player, colorset)
			{
				let x = player.x;
				let y = player.y;
		let color = colorset;
		let i = 0;
		let j = 0;
			
		while (i < modeleCanon.length)
			{
				j = 0;
				while (j < modeleCanon[i].length)
					{
						if (modeleCanon[i][j] === 1)
							{
								context.fillStyle = color;
								context.fillRect(x + j * 10, y + i * 10, 10, 10);
								player.width = 10 * modeleCanon[0].length;
								player.hitbox = [x, y, x + 10 * modeleCanon[0].length, y + player.height * modeleCanon.length];
							}
							j++;
						}
						i++;
					}
					drawlife(context, player, canvas);
				}

				function drawalien(context, alien, top, left, x, y, width, height, colorset, modele)
				{
					let i = 0;
		let j = 0;
		while (i < alien.modele.length)
			{
				j = 0;
				while (j < alien.modele[i].length)
					{
				if (alien.modele[i][j] === 1)
				{
					context.fillStyle = "green";
					context.fillRect(left + x + j * width, top + y + i * height, width, height);
					alien.width = width * modele[0].length;
					alien.height = height * modele.length;
					alien.hitbox = [left + x, top + y, left + x + width * modele[0].length, top + y + height * modele.length];
				}
				j++;
			}
			i++;
		}
	}

	function drawaliens(context, aliens, colorset)
	{
		let top = context.canvas.height * 0.1 + 20;
		let left = 0;
		for (let i = 0; i < aliens.length; i++)
		{
			for (let j = 0; j < aliens[i].length; j++)
			{
				let x = aliens[i][j].x;
				let y = aliens[i][j].y;
				drawalien(context, aliens[i][j], top, left, x, y, 10, 10, colorset, aliens[i][j].modele);
			}

		}
	}

	function drawbullets(context, bullets, colorset)
	{
		let i = 0;
		let width = 10;
		let height = 10;
		while (i < bullets.length)
		{
			context.fillStyle = "red";
			context.fillRect(bullets[i].x, bullets[i].y, width, height);
			context.fillRect(bullets[i].x, bullets[i].y + 10, width, height);
			i++;
		}
	}

	function drawScore(context, score)
	{
		context.fillStyle = "white";
		context.font = "50px New Times Roman";
		context.fillText("Score: " + score.value, 10, context.canvas.height * 0.1 - 30);
	}

	function drawtopline(context, canvas)
	{
		context.fillStyle = "white";
		context.font = "20px Arial";
		context.fillRect(10, canvas.height * 0.1 ,canvas.width, 10);
	}
	
	function draw(canvas, context, player, aliens, bullets, score, colorset)
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawtopline(context, canvas);
		drawplayer(canvas, context, player, colorset);
		drawaliens(context, aliens, colorset);
		drawScore(context, score);
		if (bullets.length > 0)
			drawbullets(context, bullets, colorset);
	}
	/*end draw*/

};