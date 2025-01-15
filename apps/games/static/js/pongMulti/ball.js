import { drawCircle, ispointintriangle, ispointinrectangle} from "./utils.js";
import { point } from "./point.js";

class Ball
{
	//cette fonction est à refaire
	ispointinbackground(point, backgroundhitbox, segdiamondtriangle, ball, canvas)
	{
		// walltop
		if (point.y < 0 || point.y > canvas.height)
			ball.dy = -ball.dy;
		if (point.x < 0 || point.x > canvas.width)
			ball.dx = -ball.dx;
		if (ispointinrectangle(point, backgroundhitbox[0]) && ball.dy < 0)
		{
			ball.dy = -ball.dy;
			return (true);
		} // wallbottom
		else if (ispointinrectangle(point, backgroundhitbox[1]) && ball.dy > 0)
		{
			if (point.x > point.y)
			{
				ball.dy = -ball.dy;
                ball.dx = -ball.dx;
			}
			ball.dy = -ball.dy;
			return (true);
		} // wallleft
		else if (ispointinrectangle(point, backgroundhitbox[2]) && ball.dx < 0)
		{
			ball.dx = -ball.dx;
			return (true);
		} // wallright
		else if (ispointinrectangle(point, backgroundhitbox[3]) && ball.dx > 0)
		{
			ball.dx = -ball.dx;
			return (true);
		} // walltopleft
		else if (ispointinrectangle(point, backgroundhitbox[4]))
		{
			if (point.y > point.x)
				ball.dy = -ball.dy;
			else 
				ball.dx = -ball.dx;
		return (true);
		} // walltopright
		else if (ispointinrectangle(point, backgroundhitbox[5]))
		{
			if (point.x - ball.speed > backgroundhitbox[5][2].x)
				ball.dy = -ball.dy;
			else
				ball.dx = -ball.dx;

			return (true);
		} // wallbottomleft
		else if (ispointinrectangle(point, backgroundhitbox[6]))
		{
			if (point.y - ball.speed > backgroundhitbox[6][1].y)
				ball.dx = -ball.dx;
			else
				ball.dy = -ball.dy;
			
			return (true);
		} // wallbottomright
		else if (ispointinrectangle(point, backgroundhitbox[7]))
		{
			if (point.y < point.x)
					ball.dy = -ball.dy;
			else 
					ball.dx = -ball.dx;
			return (true);
		} // diamondcentral
		else if (ispointintriangle(point, segdiamondtriangle.topleft) || ispointintriangle(point, segdiamondtriangle.topright) || ispointintriangle(point, segdiamondtriangle.bottomleft) || ispointintriangle(point, segdiamondtriangle.bottomright))
		{
			if (ispointintriangle(point, segdiamondtriangle.topright))
			{
				let tmp = ball.dx;
                ball.dx = -ball.dy;
                ball.dy = tmp;
			}
			else if (ispointintriangle(point, segdiamondtriangle.topleft))
			{
				let tmp = ball.dy;
				ball.dy = -ball.dx;
				ball.dx = -tmp;
			}
			else if (ispointintriangle(point, segdiamondtriangle.bottomright))
			{
				let tmp = ball.dx;
                ball.dx = -ball.dy;
                ball.dy = -tmp;
			}
			else
			{
				let tmp = ball.dy;
				ball.dy = -ball.dx;
				ball.dx = tmp;
			}
		} // centraldiamondstrokeleft
		else if (ispointintriangle(point, backgroundhitbox[8]))
		{
			if ((point.x + ball.speed < backgroundhitbox[8][0].x && point.y + ball.speed > backgroundhitbox[8][0].y))
				ball.dy = -ball.dy;
			else if ((point.x + ball.speed > backgroundhitbox[8][0].x && point.y + ball.speed < backgroundhitbox[8][0].y))
				ball.dx = -ball.dx;
			else
			{
				let tmp = ball.dy;
				ball.dy = -ball.dx;
				ball.dx = -tmp;
			}
			return (true);
		} // centraldiamondstrokeright
		else if (ispointintriangle(point, backgroundhitbox[9]))
		{
			if ((point.x + ball.speed > backgroundhitbox[9][0].x) && point.y + ball.speed > backgroundhitbox[9][2].y)
				ball.dy = -ball.dy;
			else if (point.x - ball.speed < backgroundhitbox[9][0].x)
				ball.dx = -ball.dx;
			else
			{
				let tmp = ball.dy;
				ball.dy = ball.dx;
				ball.dx = tmp;
			}
			return (true);
		} // centraldiamondstrokebottom
		else if (ispointintriangle(point, backgroundhitbox[10]))
		{
			if (point.x- ball.speed < backgroundhitbox[10][0].x && point.y - ball.speed < backgroundhitbox[10][0].y)
				ball.dy = -ball.dy;
			else if (point.x + ball.speed > backgroundhitbox[10][0].x)
				ball.dx = -ball.dx;
			else
			{
				let tmp = ball.dy;
				ball.dy = ball.dx;
				ball.dx = tmp;
			}
			return (true);
		} // centraldiamondstroketop
		else if (ispointintriangle(point, backgroundhitbox[11]))
		{
			if (point.x - ball.speed > backgroundhitbox[11][0].x && point.y - ball.speed < backgroundhitbox[11][0].y)
				ball.dy = -ball.dy;
			else if (point.x - ball.speed < backgroundhitbox[11][0].x && point.y > backgroundhitbox[11][0].y)
				ball.dx = -ball.dx;
			else
			{
                let tmp = ball.dx;
                ball.dx = -ball.dy;
                ball.dy = -tmp;
            }
			return (true);
		}
		return (false);
	}

	//cette fonction est à refaire
	ballcollision(canvas, background, player1, player2, player3, player4, ball)
	{
		const backgroundhitbox = background.getHitbox();
		const segdiamondtriangle = {
			topright: [backgroundhitbox[12][4], backgroundhitbox[12][0], backgroundhitbox[12][2]],
			topleft: [backgroundhitbox[12][4], backgroundhitbox[12][3], backgroundhitbox[12][2]],
			bottomleft: [backgroundhitbox[12][4], backgroundhitbox[12][3], backgroundhitbox[12][1]],
			bottomright: [backgroundhitbox[12][4], backgroundhitbox[12][0], backgroundhitbox[12][1]],
		};
		var trajectory = new point(ball.x, ball.y);
		trajectory.x += ball.dx * ball.speed;
		trajectory.y += ball.dy * ball.speed;

		if (this.ispointinbackground(trajectory, backgroundhitbox, segdiamondtriangle, ball,canvas))
		{
			return (0);
		} // player1
		else if (ispointinrectangle(trajectory, player1.hitbox))
		{
			ball.dx = -ball.dx;
			return (1);
		} // player2
		else if (ispointinrectangle(trajectory, player2.hitbox))
		{
			ball.dx = -ball.dx;
			return (1);
		} // player3
		else if (ispointinrectangle(trajectory, player3.hitbox))
		{
			ball.dy = -ball.dy;
			return (1);

		} // player4
		else if (ispointinrectangle(trajectory, player4.hitbox))
		{
			ball.dy = -ball.dy;
			return (1);
		}
		return (0);
	}

	update(canvas, background, player1, player2, player3, player4, ball)
	{
		ball.x += ball.dx * ball.speed;
		ball.y += ball.dy * ball.speed;
		ball.hitbox = [
			new point(ball.x - ball.radius, ball.y - ball.radius),
			new point(ball.x + ball.radius, ball.y - ball.radius),
			new point(ball.x + ball.radius, ball.y + ball.radius),
			new point(ball.x - ball.radius, ball.y + ball.radius),
		]
		const collision = this.ballcollision(canvas, background, player1, player2, player3, player4, ball);
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