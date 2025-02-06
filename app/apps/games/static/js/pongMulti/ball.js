import { drawCircle, ispointinrectangle} from "./utils.js";
import { point } from "./point.js";


function setballafterpoint(canvas, ball)
{
	console.log("ballbefore", ball);
	if (ball.x - ball.radius <= 0)
		ball.dx = 1;
	else if (ball.x + ball.radius >= canvas.width)
		ball.dx = -1;
	ball.x = canvas.width / 2;
	ball.y = canvas.height / 2;
	ball.speed = 5;
	console.log("ballafter", ball);
}

function setplayerafterpoint(canvas, player1, player2, player3, player4)
{
	player1.x = 5;
	player1.y = 312.5;
	player2.x = 690;
	player2.y = 312.5;
	player3.x = 312.5;
	player3.y = 5;
	player4.x = 312.5;
	player4.y = 690;
	if (player1.lasttouch != undefined)
	{
		if (player2.lasttouch != undefined)
		{
			if (player3.lasttouch != undefined)
			{
				if (player4.lasttouch != undefined)
				{
					//finir en ajoutant le score et check la derniere touche de balle
				}
			}
		}
	}
}
function setafterpoint(canvas, player1, player2, player3, player4, ball)
{
	if (ball.x - ball.radius <= 0)
		playerlast.score += 1;
	else if (ball.x + ball.radius >= canvas.width)
		playerlast.score += 1;
	else if (ball.y - ball.radius <= 0)
		playerlast.score += 1;
	else if (ball.y + ball.radius >= canvas.height)
		playerlast.score += 1;
	setballafterpoint(canvas, ball);
	setplayerafterpoint(canvas, player1, player2, player3, player4);
}

class Ball
{
	//cette fonction est à refaire
	ballcollision(canvas, player1, player2, player3, player4, ball)
	{
		var trajectory = new point(ball.x, ball.y);
		trajectory.x += ball.dx * ball.speed;
		trajectory.y += ball.dy * ball.speed;

		if (trajectory.x - ball.radius <= 0 || trajectory.x + ball.radius >= canvas.width)
		{
			setafterpoint(canvas, player1, player2, player3, player4, ball, last);
		}
		else if (trajectory.y - ball.radius <= 0 || trajectory.y + ball.radius >= canvas.height)
		{
			setafterpoint(canvas, player1, player2, player3, player4, ball, last);
		}
		else if (ispointinrectangle(trajectory, player1.hitbox))
		{
			ball.dx = -ball.dx;
			player1.lasttouch = Date.now();
			return (1);
		} // player2
		else if (ispointinrectangle(trajectory, player2.hitbox))
		{
			ball.dx = -ball.dx;
			player2.lasttouch = Date.now();
			return (1);
		} // player3
		else if (ispointinrectangle(trajectory, player3.hitbox))
		{
			ball.dy = -ball.dy;
			player3.lasttouch = Date.now();
			return (1);

		} // player4
		else if (ispointinrectangle(trajectory, player4.hitbox))
		{
			ball.dy = -ball.dy;
			player4.lasttouch = Date.now();
			return (1);
		}
		return (0);
	}

	update(canvas, player1, player2, player3, player4, ball)
	{
		ball.x += ball.dx * ball.speed;
		ball.y += ball.dy * ball.speed;
		ball.hitbox = [
			new point(ball.x - ball.radius, ball.y - ball.radius),
			new point(ball.x + ball.radius, ball.y - ball.radius),
			new point(ball.x + ball.radius, ball.y + ball.radius),
			new point(ball.x - ball.radius, ball.y + ball.radius),
		]
		const collision = this.ballcollision(canvas, player1, player2, player3, player4, ball);
		if (collision)
			ball.speed *= 1.3;
		
	}

	draw(context)
	{
		drawCircle(context, this.x, this.y, this.radius, this.color);
	}

	drawhitbox(context)
	{
		context.beginPath();
		context.moveTo(this.hitbox[0].x, this.hitbox[0].y);
		context.lineTo(this.hitbox[1].x, this.hitbox[1].y);
		context.lineTo(this.hitbox[2].x, this.hitbox[2].y);
		context.lineTo(this.hitbox[3].x, this.hitbox[3].y);
		context.closePath();
		context.stroke();
	}

	getHitbox()
	{
		const hitbox = [
			new point(this.x - this.radius, this.y - this.radius),
			new point(this.x + this.radius, this.y - this.radius),
			new point(this.x + this.radius, this.y + this.radius),
			new point(this.x - this.radius, this.y + this.radius),
		];
		return (hitbox);
	}

	getX()
	{
		return (this.x);
	}

	getY()
	{
		return (this.y);
	}

	getDX()
	{
		return (this.dx);
	}

	getDY()
	{
		return (this.dy);
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
			new point(this.x - this.radius, this.y + this.radius),
			new point(this.x + this.radius, this.y - this.radius),
			new point(this.x + this.radius, this.y + this.radius),
		]
	}
}

export { Ball };