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
	var size = 50;

	var A = new point(x + size, y + size);
	var B = new point(x + size, y + height / 2);
	var C = new point(x + width / 2, y + size);

	drawtriangle(context, A, B, C, color);

	A.x = x - size;
	B.x = x - size;
	C.x = x - width / 2;

	drawtriangle(context, A, B, C, color);

	A.y = y - size;
	B.y = y - height / 2;
	C.y = y - size;

	drawtriangle(context, A, B, C, color);

	A.x = x + size;
	B.x = x + size;
	C.x = x + width / 2;

	drawtriangle(context, A, B, C, color);
}

function sizeofstringdisplayed(context, string)
{
	return (context.measureText(string));
}

function ispointinrectangle(point, rectangle)
{
	if (point === undefined || rectangle === undefined)
	{
		return (false);
	}
	const [A, B, C, D] = rectangle;
	if (point.x >= A.x && point.x <= B.x && point.y >= A.y && point.y <= D.y)
		return (true);
	return (false);
}

function ispointintriangle(point, triangle)
{
	if (point === undefined || triangle === undefined)
	{
		return (false);
	}
	const [A, B, C] = triangle;
	const AB = (A.x - point.x) * (B.y - A.y) - (B.x - A.x) * (A.y - point.y);
	const BC = (B.x - point.x) * (C.y - B.y) - (C.x - B.x) * (B.y - point.y);
	const CA = (C.x - point.x) * (A.y - C.y) - (A.x - C.x) * (C.y - point.y);
	if ((AB > 0 && BC > 0 && CA > 0) || (AB < 0 && BC < 0 && CA < 0))
		return (true);
	return (false);
}

export {drawRect, drawCircle, drawdiamond, drawdiamondstroke, sizeofstringdisplayed, ispointintriangle, ispointinrectangle};