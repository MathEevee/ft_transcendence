import { drawCircle, ispointintriangle, ispointinrectangle} from "./utils.js";
import { point } from "./point.js";

class Ball
{
	//cette fonction est à refaire
	ispointinbackground(point, backgroundhitbox, segdiamondtriangle, ball)
	{
		// console.log("ball dx: ", ball.dx , " ball dy: ", ball.dy);
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
			if (point.y > point.x)
				ball.dy = -ball.dy;
			else 
			ball.dx = -ball.dx;
		return (true);
	} // walltopright
	else if (ispointinrectangle(point, backgroundhitbox[5]))
	{
			console.log("walltopright collision");
			if (point.y > point.x)
				ball.dy = -ball.dy;
			else 
				ball.dx = -ball.dx;
		// if (point.x > backgroundhitbox[5][2].x)
		// 	ball.dy = -ball.dy;
		// else if (point.y > backgroundhitbox[5][2].y)
		// 	ball.dx = -ball.dx;
		return (true);
	} // wallbottomleft
	else if (ispointinrectangle(point, backgroundhitbox[6]))
		{
			//ntm fucking conditions de con
			console.log("wallbottomleft collision");
			console.log(ball.dy, ball.dx, point.y, backgroundhitbox[6][1].y, point.x, backgroundhitbox[6][1].x);
			
			// 1 -1 527 525 123 175
			if (ball.dy > 0 && ball.dx < 0 && point.y > backgroundhitbox[6][1].y && point.x < backgroundhitbox[6][1].x)
			{
				console.log("gauche a droite en tapant le mur top");
				ball.dy = -ball.dy;
			}
			// 1 -1 578 525 172 175 ball.js:60:12
			// gauche a droite en tapant le mur top
			else if (ball.dy > 0 && ball.dx < 0 && point.y > backgroundhitbox[6][1].y && point.x < backgroundhitbox[6][1].x)
			{
				console.log("haut en bas tapant le mur droit");
				ball.dx = -ball.dx;
			}
			else if (ball.dy < 0 && ball.dx < 0 && point.y < backgroundhitbox[6][1].y && point.x > backgroundhitbox[6][1].x)
			{
				console.log("bas en haut tapant le mur droit");
				ball.dx = -ball.dx;
			}
			else if (ball.dy > 0 && ball.dx > 0 && point.y < backgroundhitbox[6][1].y && point.x < backgroundhitbox[6][1].x)
			{
				console.log("gauche a droite en tapant le mur top");
				ball.dy = -ball.dy;
			}
			return (true);
		} // wallbottomright
		else if (ispointinrectangle(point, backgroundhitbox[7]))
		{
			console.log("wallbottomright collision");
			if (point.y < point.x)
				ball.dy = -ball.dy;
			else 
				ball.dx = -ball.dx;
			return (true);
		} // diamondcentral
		else if (ispointintriangle(point, segdiamondtriangle.topleft) || ispointintriangle(point, segdiamondtriangle.topright) || ispointintriangle(point, segdiamondtriangle.bottomleft) || ispointintriangle(point, segdiamondtriangle.bottomright))
		{
			console.log("diamondcentral collision");
			if (ball.dx > 0)
				ball.dx = -ball.dx;
			else if (ball.dy > 0)
				ball.dy = -ball.dy;
		} // centraldiamondstrokeleft
		else if (ispointintriangle(point, backgroundhitbox[8]))
		{
			console.log("diamondcentral collision strokeleft");
			return (true);
		} // centraldiamondstrokeright
		else if (ispointintriangle(point, backgroundhitbox[9]))
		{
			console.log("diamondcentral collision strokeright");
			return (true);
		} // centraldiamondstrokebottom
		else if (ispointintriangle(point, backgroundhitbox[10]))
		{
			console.log("diamondcentral collision strokebottom");
			return (true);
		} // centraldiamondstroketop
		else if (ispointintriangle(point, backgroundhitbox[11]))
		{
			console.log("diamondcentral collision stroketop");
			return (true);
		}
		return (false);
	}

	//cette fonction est à refaire
	ballcollision(canvas, background, player1, player2, player3, player4, ball)
	{
		const backgroundhitbox = background.getHitbox();
		const segdiamondtriangle = {
			topleft: [backgroundhitbox[12][0], backgroundhitbox[12][1], backgroundhitbox[12][4]],
			topright: [backgroundhitbox[12][1], backgroundhitbox[12][2], backgroundhitbox[12][4]],
			bottomleft: [backgroundhitbox[12][0], backgroundhitbox[12][3], backgroundhitbox[12][4]],
			bottomright: [backgroundhitbox[12][2], backgroundhitbox[12][3], backgroundhitbox[12][4]],
			center: [backgroundhitbox[12][4], backgroundhitbox[12][5], backgroundhitbox[12][6]],
			radius: 5,
		};
		var trajectory = new point(ball.x, ball.y);
		trajectory.x += ball.dx * ball.speed;
		trajectory.y += ball.dy * ball.speed;
		if (this.ispointinbackground(trajectory, backgroundhitbox, segdiamondtriangle, ball))
		{
			return (0);
		} // player1
		else if (trajectory.x - ball.radius <= player1.x + player1.width && trajectory.y >= player1.y && trajectory.y <= player1.y + player1.height)
		{
			console.log("player1 collision");
			ball.dx = -ball.dx;
			return (1);
		} // player2
		else if (trajectory.x + ball.radius >= player2.x && trajectory.y >= player2.y && trajectory.y <= player2.y + player2.height)
		{
			console.log("player2 collision");
			ball.dx = -ball.dx;
			return (1);
		} // player3
		else if (trajectory.y - ball.radius <= player3.y + player3.height && trajectory.x >= player3.x && trajectory.x <= player3.x + player3.width)
		{
			console.log("player3 collision");
			ball.dy = -ball.dy;
			return (1);

		} // player4
		else if (trajectory.y + ball.radius >= player4.y && trajectory.x >= player4.x && trajectory.x <= player4.x + player4.width)
		{
			console.log("player4 collision");
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