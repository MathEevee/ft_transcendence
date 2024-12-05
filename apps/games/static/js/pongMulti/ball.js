import { drawCircle, ispointintriangle, ispointinrectangle} from "./utils.js";
import { point } from "./point.js";

class Ball
{
	ispointinbackground(point, backgroundhitbox, segdiamondtriangle, ball)
	{
		// walltop
		if (ispointinrectangle(point, backgroundhitbox[0]) && ball.dy < 0)
		{
			console.log("walltop collision");
			ball.dy = -ball.dy;
			return (true);
		} // wallbottom
		else if (ispointinrectangle(point, backgroundhitbox[1]) && ball.dy > 0)
		{
			console.log("wallbottom collision");
			ball.dy = -ball.dy;
			return (true);
		} // wallleft
		else if (ispointinrectangle(point, backgroundhitbox[2]) && ball.dx < 0)
		{
			console.log("walleft collision");
			ball.dx = -ball.dx;
			return (true);
		} // wallright
		else if (ispointinrectangle(point, backgroundhitbox[3]) && ball.dx > 0)
		{
			console.log("wallright collision");
			ball.dx = -ball.dx;
			return (true);
		} // walltopleft
		else if (ispointinrectangle(point, backgroundhitbox[4]))
		{
			console.log("walltopleft collision");
			if (ball.dy < 0)
				ball.dy = -ball.dy;
			else if (ball.dx < 0)
				ball.dx = -ball.dx;
			return (true);
		} // walltopright
		else if (ispointinrectangle(point, backgroundhitbox[5]))
		{
			console.log("walltopright collision");
			if (ball.dy < 0)
				ball.dy = -ball.dy;
			else if (ball.dx > 0)
				ball.dx = -ball.dx;
			return (true);
		} // wallbottomleft
		else if (ispointinrectangle(point, backgroundhitbox[6]))
		{
			console.log("wallbottomleft collision");
			if (ball.dy > 0)
				ball.dy = -ball.dy;
			else if (ball.dx < 0)
				ball.dx = -ball.dx;
			return (true);
		} // wallbottomright
		else if (ispointinrectangle(point, backgroundhitbox[7]))
		{
			console.log("wallbottomright collision");
			if (ball.dy > 0)
				ball.dy = -ball.dy;
			else if (ball.dx > 0)
				ball.dx = -ball.dx;
			return (true);
		} // diamondtop
		// else if (ispointintriangle(point, segdiamondtriangle.topleft) && ball.dy < 0)
		// {
		// 	console.log("diamondtop collision");
		// 	ball.dy = -ball.dy;
		// 	return (true);
		// } // diamondright
		// else if (ispointintriangle(point, segdiamondtriangle.topright) && ball.dx > 0)
		// {
		// 	console.log("diamondright collision");
		// 	ball.dx = -ball.dx;
		// 	return (true);
		// } // diamondbottom
		// else if (ispointintriangle(point, segdiamondtriangle.bottomright) && ball.dy > 0)
		// {
		// 	console.log("diamondbottom collision");
		// 	ball.dy = -ball.dy;
		// 	return (true);
		// } // diamondleft
		// else if (ispointintriangle(point, segdiamondtriangle.bottomleft) && ball.dx < 0)
		// {
		// 	console.log("diamondleft collision");
		// 	ball.dx = -ball.dx;
		// 	return (true);
		// }
	}

	ballcollision(canvas, background, player1, player2, player3, player4, ball)
	{
		const backgroundhitbox = background.getHitbox();
		const segdiamondtriangle = {
			topleft: [backgroundhitbox[12][0], backgroundhitbox[12][1], backgroundhitbox[12][4]],
			topright: [backgroundhitbox[12][1], backgroundhitbox[12][2], backgroundhitbox[12][4]],
			bottomleft: [backgroundhitbox[12][0], backgroundhitbox[12][3], backgroundhitbox[12][4]],
			bottomright: [backgroundhitbox[12][2], backgroundhitbox[12][3], backgroundhitbox[12][4]],
		};
		var trajectory = new point(ball.x, ball.y);
		while (this.ispointinbackground(trajectory, backgroundhitbox, segdiamondtriangle, ball) &&
			trajectory.x - ball.radius > 0 && trajectory.x + ball.radius < canvas.width &&
			trajectory.y - ball.radius > 0 && trajectory.y + ball.radius < canvas.height &&
			trajectory.x - ball.radius > player1.x + player1.width && trajectory.x + ball.radius < player2.x &&
			trajectory.y - ball.radius > player3.y + player3.height && trajectory.y + ball.radius < player4.y)
		{
			trajectory.x += ball.dx * ball.speed;
			trajectory.y += ball.dy * ball.speed;
		}
		if (this.ispointinbackground(trajectory, backgroundhitbox, segdiamondtriangle, ball))
			return (0);
		else if (trajectory.x - ball.radius <= player1.x + player1.width && trajectory.y >= player1.y && trajectory.y <= player1.y + player1.height)
		{
			console.log("player1 collision");
			ball.dx = -ball.dx;
			ball.dy = -ball.dy;
			return (1);
		}
		else if (trajectory.x + ball.radius >= player2.x && trajectory.y >= player2.y && trajectory.y <= player2.y + player2.height)
		{
			console.log("player2 collision");
			ball.dx = -ball.dx;
			ball.dy = -ball.dy;
			return (1);
		}
		else if (trajectory.y - ball.radius <= player3.y + player3.height && trajectory.x >= player3.x && trajectory.x <= player3.x + player3.width)
		{
			console.log("player3 collision");
			ball.dy = -ball.dy;
			ball.dx = -ball.dx;
			return (1);

		}
		else if (trajectory.y + ball.radius >= player4.y && trajectory.x >= player4.x && trajectory.x <= player4.x + player4.width)
		{
			console.log("player4 collision");
			ball.dy = -ball.dy;
			ball.dx = -ball.dx;
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
			ball.speed += 0.5;
		
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