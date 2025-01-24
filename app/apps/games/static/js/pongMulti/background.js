import { point } from "./point.js";
import { drawdiamond, drawdiamondstroke, drawCircle } from "./utils.js";

class background
{
	drawset(canvas, context, colorset)
	{
		const crossWidth = canvas.width - 10;
		const crossHeight = canvas.height - 10;
		const borderThickness = canvas.width * 0.5;
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;

		context.strokeStyle = colorset.netcolor;
		context.lineWidth = 5;

		// Rectangle horizontal
		context.strokeRect(
			centerX - crossWidth / 2,
			centerY - borderThickness / 2,  
			crossWidth,                     
			borderThickness                 
		);

		// Rectangle vertical
		context.strokeRect(
			centerX - borderThickness / 2,  
			centerY - crossHeight / 2,      
			borderThickness,                
			crossHeight                     
		);

		// supression des bordures interieures
		context.fillStyle = colorset.backgroundcolor;
		context.fillRect(centerX - crossWidth / 2, centerY - borderThickness / 2, crossWidth, borderThickness);
		context.fillRect(centerX - borderThickness / 2, centerY - crossHeight / 2, borderThickness, crossHeight);

		// losange central coupe en 4
		drawdiamondstroke(context, centerX, centerY, borderThickness, borderThickness, colorset.netcolor);

		// losange central
		drawdiamond(context, centerX - 25, centerY - 25, 50, 50, colorset.netcolor);
	}

	draw(context, canvas, colorset)
	{
		context.fillStyle = colorset.backgroundcolor;
		context.fillRect(0, 0, canvas.width, canvas.height);
		this.drawset(canvas, context, colorset);
	}

	drawrectangularhitbox(context, A, B, C, D, color)
	{
		context.strokeStyle = color;
		context.lineWidth = 1;
		
		context.beginPath();
		context.moveTo(A.x, A.y);
		context.lineTo(B.x, B.y);
		context.lineTo(D.x, D.y);
		context.lineTo(C.x, C.y);
		context.closePath();
		context.stroke();
	}

	drawtrianglehitbox(context, A, B, C, color)
	{
		context.strokeStyle = color;
		context.lineWidth = 1;

		context.beginPath();
		context.moveTo(A.x, A.y);
		context.lineTo(B.x, B.y);
		context.lineTo(C.x, C.y);
		context.closePath();
		context.stroke();
	}

	drawfourpoint(context, point1, point2, point3, point4, color)
	{
		context.strokeStyle = color;

		drawCircle(context, point1.x, point1.y, 5, color);
		drawCircle(context, point2.x, point2.y, 5, color);
		drawCircle(context, point3.x, point3.y, 5, color);
		drawCircle(context, point4.x, point4.y, 5, color);
	}

	drawhitbox(context, colorset)
	{
		context.strokeStyle = "red";
		context.lineWidth = 1;

		// exterior wall
		this.drawrectangularhitbox(context, this.exteriorwall.walltop[0], this.exteriorwall.walltop[1], this.exteriorwall.walltop[2], this.exteriorwall.walltop[3], "red");
		this.drawrectangularhitbox(context, this.exteriorwall.wallbottom[0], this.exteriorwall.wallbottom[1], this.exteriorwall.wallbottom[2], this.exteriorwall.wallbottom[3], "red");
		this.drawrectangularhitbox(context, this.exteriorwall.wallleft[0], this.exteriorwall.wallleft[1], this.exteriorwall.wallleft[2], this.exteriorwall.wallleft[3], "red");
		this.drawrectangularhitbox(context, this.exteriorwall.wallright[0], this.exteriorwall.wallright[1], this.exteriorwall.wallright[2], this.exteriorwall.wallright[3], "red");
		this.drawrectangularhitbox(context, this.exteriorwall.walltopleft[0], this.exteriorwall.walltopleft[1], this.exteriorwall.walltopleft[2], this.exteriorwall.walltopleft[3], "red");
		this.drawrectangularhitbox(context, this.exteriorwall.walltopright[0], this.exteriorwall.walltopright[1], this.exteriorwall.walltopright[2], this.exteriorwall.walltopright[3], "red");
		this.drawrectangularhitbox(context, this.exteriorwall.wallbottomleft[0], this.exteriorwall.wallbottomleft[1], this.exteriorwall.wallbottomleft[2], this.exteriorwall.wallbottomleft[3], "red");
		this.drawrectangularhitbox(context, this.exteriorwall.wallbottomright[0], this.exteriorwall.wallbottomright[1], this.exteriorwall.wallbottomright[2], this.exteriorwall.wallbottomright[3], "red");

		// central diamond
		this.drawrectangularhitbox(context, this.diamondcentral[0], this.diamondcentral[1], this.diamondcentral[2], this.diamondcentral[3], "red");

		// central diamond stroke
		this.drawtrianglehitbox(context, this.centraldiamondstroke.topleft[0], this.centraldiamondstroke.topleft[1], this.centraldiamondstroke.topleft[2], "red");
		this.drawtrianglehitbox(context, this.centraldiamondstroke.topright[0], this.centraldiamondstroke.topright[1], this.centraldiamondstroke.topright[2], "red");
		this.drawtrianglehitbox(context, this.centraldiamondstroke.bottomleft[0], this.centraldiamondstroke.bottomleft[1], this.centraldiamondstroke.bottomleft[2], "red");
		this.drawtrianglehitbox(context, this.centraldiamondstroke.bottomright[0], this.centraldiamondstroke.bottomright[1], this.centraldiamondstroke.bottomright[2], "red");

		// draw four point

		drawCircle(context, this.centraldiamondstroke.topleft[0].x,this.centraldiamondstroke.topleft[0].y, 10 ,"red");
		drawCircle(context, this.centraldiamondstroke.topright[0].x,this.centraldiamondstroke.topright[0].y, 10 ,"red");
		drawCircle(context, this.centraldiamondstroke.bottomleft[0].x,this.centraldiamondstroke.bottomleft[0].y, 10 ,"red");
		drawCircle(context, this.centraldiamondstroke.bottomright[0].x,this.centraldiamondstroke.bottomright[0].y, 10 ,"red");
	}

	getHitbox()
	{
		const hitbox = [
			this.exteriorwall.walltop,
			this.exteriorwall.wallbottom,
			this.exteriorwall.wallleft,
			this.exteriorwall.wallright,
			this.exteriorwall.walltopleft,
			this.exteriorwall.walltopright,
			this.exteriorwall.wallbottomleft,
			this.exteriorwall.wallbottomright,
			this.centraldiamondstroke.topleft,
			this.centraldiamondstroke.topright,
			this.centraldiamondstroke.bottomleft,
			this.centraldiamondstroke.bottomright,
			this.diamondcentral,
		];
		return (hitbox);
	}

	constructor(x, y, width, height, color, canvas)
	{
		const borderThickness = canvas.width * 0.5;

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.exteriorwall =
		{
			walltop: [
				new point(canvas.width / 2 - borderThickness / 2, 0),
				new point(canvas.width / 2 + borderThickness / 2, 0),
				new point(canvas.width / 2 - borderThickness / 2, 5),
				new point(canvas.width / 2 + borderThickness / 2, 5),
			],
			wallbottom: [
				new point(canvas.width / 2 - borderThickness / 2, canvas.height - 5),
				new point(canvas.width / 2 + borderThickness / 2, canvas.height - 5),
				new point(canvas.width / 2 - borderThickness / 2, canvas.height),
				new point(canvas.width / 2 + borderThickness / 2, canvas.height),
			],
			wallleft: [
				new point(0, canvas.height / 2 - borderThickness / 2),
				new point(5, canvas.height / 2 - borderThickness / 2),
				new point(0, canvas.height / 2 + borderThickness / 2),
				new point(5, canvas.height / 2 + borderThickness / 2),
			],
			wallright: [
				new point(canvas.width - 5, canvas.height / 2 - borderThickness / 2),
				new point(canvas.width, canvas.height / 2 - borderThickness / 2),
				new point(canvas.width - 5, canvas.height / 2 + borderThickness / 2),
				new point(canvas.width, canvas.height / 2 + borderThickness / 2),
			],
			walltopleft: [
				new point(0, 0),
				new point(canvas.width / 2 - borderThickness / 2, 0),
				new point(0, borderThickness / 2),
				new point(canvas.width / 2 - borderThickness / 2, borderThickness / 2),
			],
			walltopright: [
				new point(canvas.width / 2 + borderThickness / 2, 0),
				new point(canvas.width, 0),
				new point(canvas.width / 2 + borderThickness / 2, borderThickness / 2),
				new point(canvas.width, borderThickness / 2),
			],
			wallbottomleft: [
				new point(0, canvas.height - borderThickness / 2),
				new point(canvas.width / 2 - borderThickness / 2, canvas.height - borderThickness / 2),
				new point(0, canvas.height),
				new point(canvas.width / 2 - borderThickness / 2, canvas.height),
			],
			wallbottomright: [
				new point(canvas.width / 2 + borderThickness / 2, canvas.height - borderThickness / 2),
				new point(canvas.width, canvas.height - borderThickness / 2),
				new point(canvas.width / 2 + borderThickness / 2, canvas.height),
				new point(canvas.width, canvas.height),
			],
		};
		
		this.diamondcentral =
		[
			new point(canvas.width / 2 + 25, canvas.height / 2),
			new point(canvas.width / 2, canvas.height / 2 + 25),
			new point(canvas.width / 2, canvas.height / 2 - 25),
			new point(canvas.width / 2 - 25, canvas.height / 2),
			new point(canvas.width / 2, canvas.height / 2),
		];

		this.centraldiamondstroke =
		{
			topleft: [
				new point(canvas.width / 2 - 50, canvas.height / 2 - 50),
				new point(canvas.width / 2 - borderThickness / 7, canvas.height / 2 - borderThickness / 2),
				new point(canvas.width / 2 - borderThickness / 2, canvas.height / 2 - borderThickness / 7),
			],
			topright: [
				new point(canvas.width / 2 + 50, canvas.height / 2 - 50),
				new point(canvas.width / 2 + borderThickness / 7, canvas.height / 2 - borderThickness / 2),
				new point(canvas.width / 2 + borderThickness / 2, canvas.height / 2 - borderThickness / 7),
			],
			bottomleft: [
				new point(canvas.width / 2 - 50, canvas.height / 2 + 50),
				new point(canvas.width / 2 - borderThickness / 7, canvas.height / 2 + borderThickness / 2),
				new point(canvas.width / 2 - borderThickness / 2, canvas.height / 2 + borderThickness / 7),
			],
			bottomright: [
				new point(canvas.width / 2 + 50, canvas.height / 2 + 50),
				new point(canvas.width / 2 + borderThickness / 7, canvas.height / 2 + borderThickness / 2),
				new point(canvas.width / 2 + borderThickness / 2, canvas.height / 2 + borderThickness / 7),
			],
		};

	}
}

export { background };