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
				diralien *= -1;
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
			if (bullet.x < aliens[i][j].coordonnees[0] && bullet.x > aliens[i][j].coordonnees[0] - aliens[i][j].width && bullet.y < aliens[i][j].coordonnees[1] && bullet.y > aliens[i][j].coordonnees[1] - aliens[i][j].height)
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

function playertouchalien(player, aliens)
{
	let i = 0;
	while (i < aliens.length)
	{
		let j = 0;
		while (j < aliens[i].length)
		{
			if (player.x < aliens[i][j].coordonnees[0] + aliens[i][j].width && player.x + player.width > aliens[i][j].coordonnees[0] && player.y < aliens[i][j].coordonnees[1] + aliens[i][j].height && player.y + player.height > aliens[i][j].coordonnees[1])
				return (1);
			j++;
		}
		i++;
	}
	return (0);
}

function printmsg(msg, x, y, color, context)
{
	context.fillStyle = color;
	context.font = "50px Arial";
	context.textAlign = "center";
	context.f
}

function gamefinished(aliens, player, canvas, context)
{
	if (aliens.length === 0)
	{
		printmsg("You win", canvas.width / 2, canvas.height / 2, "white", context);
		return (1);
	}
	if (player.lives === 0 || playertouchalien(player, aliens) === 1)
	{
		printmsg("You lose", canvas.width / 2, canvas.height / 2, "white", context);
		return (1);
	}
	return (0);
}

function update(player, aliens, bullets, canvas, context, score)
{
	updateplayer(player, canvas);
	updatealiens(aliens, canvas);
	if (bullets.length > 0)
		updatebullets(bullets, canvas, context, aliens, score);
	if (gamefinished(aliens, player, canvas) === 1)
	{
		document.location.reload();
	}
}


export { update }