class point
{
	equal(A, B)
	{
		if (A.x === B.x && A.y === B.y)
			return (true);
		return (false);
	}

	unequal(A, B)
	{
		if (A.x !== B.x || A.y !== B.y)
			return (true);
		return (false);
	}

	inferior(A, B)
	{
		if (A.x < B.x && A.y < B.y)
			return (true);
		return (false);
	}

	superior(A, B)
	{
		if (A.x > B.x && A.y > B.y)
			return (true);
		return (false);
	}

	inferiorequal(A, B)
	{
		if (A.x <= B.x && A.y <= B.y)
			return (true);
		return (false);
	}

	superiorequal(A, B)
	{
		if (A.x >= B.x && A.y >= B.y)
			return (true);
		return (false);
	}

	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}
}

export { point };