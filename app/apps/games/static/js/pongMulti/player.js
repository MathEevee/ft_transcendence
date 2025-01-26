import { drawdiamond, drawRect } from './utils.js';
import { point } from './point.js';

class Player
{
	update(canvas)
	{
		if (this.y + this.dy < 0 || this.y + this.dy + this.height > canvas.height)
			return ;
		if (this.x + this.dx < 0 || this.x + this.dx + this.width > canvas.width)
			return ;
		this.x += this.dx;
		this.y += this.dy;
		this.hitbox = [
			new point(this.x, this.y),
			new point(this.x + this.width, this.y),
			new point(this.x + this.width, this.y + this.height),
			new point(this.x, this.y + this.height),
		];
	}

	goUp()
	{
		this.dy = -this.speed;
	}

	goDown()
	{
		this.dy = this.speed;
	}

	goLeft()
	{
		this.dx = -this.speed;
	}

	goRight()
	{
		this.dx = this.speed;
	}

	stop()
	{
		this.dy = 0;
		this.dx = 0;
	}

	draw(context)
	{
		drawRect(context, this.x, this.y, this.width, this.height, this.color);
	}

	getHitbox()
	{
		const hitbox = [
			new point(this.x, this.y),
			new point(this.x + this.width, this.y),
			new point(this.x + this.width, this.y + this.height),
			new point(this.x, this.y + this.height),
		];
		return (hitbox);
	}

	constructor(x, y, width, height, color, team, speed) {
		this.x = x;
		this.y = y;
		this.dx = 0;
		this.dy = 0;
		this.width = width;
		this.height = height;
		this.color = color;
		this.score = 0;
		this.speed = speed;
		this.hitbox = [
			new point(this.x, this.y),
			new point(this.x + this.width, this.y),
			new point(this.x + this.width, this.y + this.height),
			new point(this.x, this.y + this.height),
		]
		this.up = false;
		this.down = false;
		team = team;
	}
}

export { Player };