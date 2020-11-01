let map1, map2, map3, map4;
let strc = [];

function Map(start, meta, struct)
{
	this.start = start;
	this.meta = new Circle(meta.x,meta.y,25,"#060");
	this.struct = struct;
	this.open = function()
	{
		startPoint = this.start;
		target = this.meta;
		obstacles = this.struct;
	}
	this.draw = function()
	{
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,canvasW,canvasH);

		ctx.beginPath();
		ctx.strokeStyle = "rgba(255,255,255,0.1)";
		ctx.arc(start.x,start.y,30,0,2*Math.PI);
		ctx.stroke();

		for(let i =0; i < this.struct.length; i++)
		{
			this.struct[i].draw();
		}

		this.meta.draw();
	}
}

// map1
strc[0] = new Circle(canvasW/2,canvasH/2,canvasH*0.25);
//walls
strc[1] = new Squer(0, 0, canvasW, 5);
strc[2] = new Squer(0, canvasH-5, canvasW, 5);
strc[3] = new Squer(0, 0, 5, canvasH);
strc[4] = new Squer(canvasW-5, 0, 5, canvasH);
map1 = new Map({x :100, y :canvasH/2}, {x: canvasW-100, y: canvasH/2}, strc);
// map1 end

// map 2
strc =[];
strc[0] = new Circle(canvasW/2,canvasH/2,canvasH*0.25);
strc[1] = new Circle(canvasW*0.75,canvasH*0.2,canvasH*0.2);
strc[2] = new Circle(canvasW*0.75,canvasH*0.8,canvasH*0.2);
strc[3] = new Circle(canvasW*0.25,canvasH*0.2,canvasH*0.2);
strc[4] = new Circle(canvasW*0.25,canvasH*0.8,canvasH*0.2);
//walls
strc[5] = new Squer(0, 0, canvasW, 5);
strc[6] = new Squer(0, canvasH-5, canvasW, 5);
strc[7] = new Squer(0, 0, 5, canvasH);
strc[8] = new Squer(canvasW-5, 0, 5, canvasH);
map2 = new Map({x :100, y :canvasH/2}, {x: canvasW-100, y: canvasH/2}, strc);
// map2 end

// map3
strc = [];
strc[0] = new Circle(canvasW*0.445,canvasH*0.25,175);
strc[1] = new Circle(canvasW*0.565,canvasH*0.75,175);
//walls
strc[2] = new Squer(0, 0, canvasW, 5);
strc[3] = new Squer(0, canvasH-5, canvasW, 5);
strc[4] = new Squer(0, 0, 5, canvasH);
strc[5] = new Squer(canvasW-5, 0, 5, canvasH);
map3 = new Map({x :100, y :canvasH/2}, {x: canvasW-100, y: canvasH/2}, strc);
// map3 end

// map4
strc = [];
strc[0] = new Squer(canvasW/2-250, canvasH/2-15, 500, 30);
strc[1] = new Squer(canvasW/2-250, canvasH/2-85, 500, 30);
strc[2] = new Squer(canvasW/2-250, canvasH/2+55, 500, 30);
strc[3] = new Squer(canvasW/2-250, 0, 500, 200);
strc[4] = new Squer(canvasW/2-250, canvasH/2+145, 500, 200);
//walls
strc[5] = new Squer(0, 0, canvasW, 5);
strc[6] = new Squer(0, canvasH-5, canvasW, 5);
strc[7] = new Squer(0, 0, 5, canvasH);
strc[8] = new Squer(canvasW-5, 0, 5, canvasH);
map4 = new Map({x :100, y :canvasH/2}, {x: canvasW-100, y: canvasH/2}, strc);
// map4 end