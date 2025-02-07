import { drawCircle, ispointinrectangle} from "./utils.js";
import { point } from "./point.js";
import { lasthit } from "./player.js";


class Ball
{
	//cette fonction est à refaire
	ballcollision(canvas, player1, player2, player3, player4, ball)
	{
		var trajectory = new point(ball.x, ball.y);
		trajectory.x += ball.dx * ball.speed;
		trajectory.y += ball.dy * ball.speed;

		if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width)
		{
			return 2;
		}
		else if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height)
		{
			return 2;
		}
		else if (ispointinrectangle(trajectory, player1.hitbox))
		{
			ball.dx = -ball.dx;
			lasthit.lasthit = 1;
			return (1);
		} // player2 
		else if (ispointinrectangle(trajectory, player2.hitbox))
		{
			ball.dy = -ball.dy;
			lasthit.lasthit = 2;
			return (1);

		} // player3
		else if (ispointinrectangle(trajectory, player3.hitbox))
		{
			ball.dx = -ball.dx;
			lasthit.lasthit = 3;
			return (1);
		} // player4
		else if (ispointinrectangle(trajectory, player4.hitbox))
		{
			ball.dy = -ball.dy;
			lasthit.lasthit = 4;
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
		if (collision == 1)
			ball.speed *= 1.3;
		else if (collision == 2)
			return (2);
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