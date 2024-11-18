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

export { update }