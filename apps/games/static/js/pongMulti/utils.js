import {point} from './point.js';

function drawRect(context, x, y, width, height, color)
{
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

function drawtriangle(context, point1, point2, point3, color)
{
	context.fillStyle = color;
	context.beginPath();
	context.moveTo(point1.x, point1.y);
	context.lineTo(point2.x, point2.y);
	context.lineTo(point3.x, point3.y);
	context.closePath();
	context.fill();
}

function drawCircle(context, x, y, radius, color)
{
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2);
	context.closePath();
	context.fill();
}

function drawdiamond(context, x, y, width, height, color)
{
	context.fillStyle = color;

	context.beginPath();
	context.moveTo(x + width / 2, y);
	context.lineTo(x + width, y + height / 2);
	context.lineTo(x + width / 2, y + height);
	context.lineTo(x, y + height / 2);
	context.closePath();
	context.fill();
}


function drawdiamondstroke(context, x, y, width, height, color)
{
	context.lineWidth = 5;
	context.fillStyle = color;

	var A = new point(x + 50, y + 50);
	var B = new point(x + 50, y + height / 2);
	var C = new point(x + width / 2, y + 50);

	drawtriangle(context, A, B, C, color);

	A.x = x - 50;
	B.x = x - 50;
	C.x = x - width / 2;

	drawtriangle(context, A, B, C, color);

	A.y = y - 50;
	B.y = y - height / 2;
	C.y = y - 50;

	drawtriangle(context, A, B, C, color);

	A.x = x + 50;
	B.x = x + 50;
	C.x = x + width / 2;

	drawtriangle(context, A, B, C, color);
}

function sizeofstringdisplayed(context, string)
{
	return (context.measureText(string));
}

function hitboxcollision(hitbox1, hitbox2)
{
	if (hitbox1.length === 4 && hitbox2.length === 4)
	{
		const A1 = hitbox1[0], B1 = hitbox1[1], C1 = hitbox1[2], D1 = hitbox1[3];
		const A2 = hitbox2[0], B2 = hitbox2[1], C2 = hitbox2[2], D2 = hitbox2[3];
		var collisionpoint = new point(A2.x, A2.y);
	
		// Vérifier les collisions avec le système d'axes alignés (AABB)
		if (A1.x < C2.x && C1.x > A2.x && A1.y < C2.y && C1.y > A2.y)
		{
			console.log(A1);
			collisionpoint = new point(A1.x, A1.y);
			return collisionpoint;
		}
		return collisionpoint;
	}
	else if (hitbox1.length === 3 && hitbox2.length === 3)
	{
		const A1 = hitbox1[0], B1 = hitbox1[1], C1 = hitbox1[2];
		const A2 = hitbox2[0], B2 = hitbox2[1], C2 = hitbox2[2];
		var collisionpoint = new point(A2.x, A2.y);
	
		// Vérifier les collisions avec le système d'axes alignés (AABB)
		if (A1.x < C2.x && C1.x > A2.x && A1.y < C2.y && C1.y > A2.y)
		{
			console.log(A1);
			collisionpoint = new point(A1.x, A1.y);
			return collisionpoint;
		}
		return collisionpoint;
	}
}

export {drawRect, drawCircle, drawdiamond, drawdiamondstroke, sizeofstringdisplayed, hitboxcollision};