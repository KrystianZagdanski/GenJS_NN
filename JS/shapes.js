class Circle
{
	constructor(x, y, r, color)
	{
		this.x = x;
		this.y = y;
		this.r = r;
		this.collider = new Collider(x, y, r);
		if(color)
			this.color = color;
		else
			this.color = "#222";
	}
	draw()
	{
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
		ctx.fill();	
	}
}

class Squer
{
	constructor(x, y, w, h, color)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.collider = new Collider(x, y, w, h);
		if(color)
			this.color = color;
		else
			this.color = "#222";
	}
	draw()
	{
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
	}
}