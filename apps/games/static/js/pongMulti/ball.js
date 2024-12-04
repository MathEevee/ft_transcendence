import { drawCircle, hitboxcollision} from "./utils.js";
import { point } from "./point.js";

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
		var collisionpoint = 0;
		for (var i = 0; i < allcollision.length; i++)
		{
			if (allcollision[i] !== 0)
			{
				collisionpoint = allcollision[i];
				break;
			}
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
			this.playerballcollision(player1, ball) ||
			this.playerballcollision(player2, ball) ||
			this.playerballcollision(player3, ball) ||
			this.playerballcollision(player4, ball) ||
			this.backgroundballcollision(background, ball)
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
			ball.dx = -ball.dx;
			ball.dy = -ball.dy * Math.random();
			// console.log(ball.dx, ball.dy);
			// console.log(ball.speed);
		}
	}

	draw(context)
	{
		drawCircle(context, this.x, this.y, this.radius, this.color);
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

export { Ball };