import { point } from "./point.js";
import { drawdiamond, drawdiamondstroke, drawCircle } from "./utils.js";

class background
{
	constructor(x, y, width, height, color, canvas)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
	}
}

export { background };