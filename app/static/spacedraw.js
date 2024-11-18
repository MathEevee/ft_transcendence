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

const modeleAlien1 = [
	[0, 0, 1, 0, 0],
	[0, 1, 1, 1, 0],
	[1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1],
	[1, 0, 1, 0, 1],
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

export { draw };