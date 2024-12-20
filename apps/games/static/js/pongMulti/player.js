import { drawdiamond, drawRect } from './utils.js';
import { point } from './point.js';

class Player
{
	update()
	{
		this.y += this.dy;
		this.hitbox = [
			new point(this.x, this.y),
			new point(this.x + this.width, this.y),
			new point(this.x + this.width, this.y + this.height),
			new point(this.x, this.y + this.height),
		]
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