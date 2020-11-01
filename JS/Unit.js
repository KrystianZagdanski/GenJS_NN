class Unit
{
    constructor(x, y, r, dna)
    {
		//test
		this.drawBrain = false;
		//end test
        this.x = x;
		this.y = y;
        this.r = r;
		this.rotation = 0;
		this.eyeLen = this.r*10;
		this.eyes = [];
		for(let i = 0; i < 5; i++)
		{
			let angle = -90;
			angle += 45*i;
			this.eyes.push({
				angle: angle,
				x: this.x + (this.eyeLen) * Math.cos(this.rotation+angle * Math.PI / 180),
				y: this.y + (this.eyeLen) * Math.sin(this.rotation+angle * Math.PI / 180),
				collider: new Collider(x, y, null, null, this.x, this.y, this.eyeLen),
				triger: 0
			});
		}
		this.inputSize = this.eyes.length+2;
		this.brainLayers = [this.inputSize, 5, 4, 3];

		this.speed = 4;
		this.turnSpeed = 10;
		
        this.fitness = 0; // how good unit is
		this.ttc = 0; // Time To Complete task
        this.alive = true;
        this.win = false; // complete task (in this generation)
        this.lastWinner = false; // complete task in last gen and was rewrite to new generation
        this.best = false; // was one of the best in last gen and was rewrite to new generation
		this.distance = 999999; // distance from target (curent)
		this.bestDistance = 999999; // closest distance from target
		this.collider = new Collider(this.x, this.y, this.r);
		this.changedPosition = 0;
		this.lastXDisToFin = 0;
		this.lastYDisToFin = 0;

		if(dna)
		{
			this.brain = new Brain(this.brainLayers);
			this.brain.init(dna[0], dna[1]);
		}
		else
		{
			this.brain = new Brain(this.brainLayers);
			this.brain.init();
		}
            
    }
    move()
    {
		let currentDistance = Distance(this,target);
		if(this.bestDistance - currentDistance > 0)
			this.bestDistance = currentDistance;
		this.distance = currentDistance;
		
		if(this.alive && !this.win)
		{
			if(this.changedPosition > 50)
			{
				this.alive = false;
				alive--;
				return;
			}
			
			let speed = 0;
			// TODO: Fix it!
			let xDisToFin = Math.sqrt(Math.pow(target.x-this.x, 2));
			let yDisToFin = Math.sqrt(Math.pow(target.y- this.y, 2));
			let xDisDiffer = 1-(this.lastXDisToFin-xDisToFin) / canvasW;
			let yDisDiffer = 1-(this.lastYDisToFin-yDisToFin) / canvasH;
			// let input = [this.eyes[0].triger, this.eyes[1].triger, this.eyes[2].triger, this.eyes[3].triger, this.eyes[4].triger, xDisToFin, yDisToFin];
			let input = [this.eyes[0].triger, this.eyes[1].triger, this.eyes[2].triger, this.eyes[3].triger, this.eyes[4].triger, xDisDiffer, yDisDiffer];
			this.lastXDisToFin = xDisToFin;
			this.lastYDisToFin = yDisToFin;
			let move = this.brain.feedForward(input);
			// draw brain
			if(this.drawBrain)
				this.brain.draw(nnCtx, canvasW, canvasH);

			if(move[0] >= 0.8 && move[1] < 0.8)
			{
				this.rotation -= this.turnSpeed;
				if(this.changedPosition > 0)
					this.changedPosition -= 0.4;
			}
			if(move[1] >= 0.8 && move[0] < 0.8)
			{
				this.rotation += this.turnSpeed;
				if(this.changedPosition > 0)
					this.changedPosition -= 0.4;
			}
			if(move[2] >= 0.8)
			{
				speed = this.speed;
				this.changedPosition = 0;
			}
			

			this.rotation %= 360;
			this.x += speed * Math.cos(this.rotation * Math.PI / 180);
    		this.y += speed * Math.sin(this.rotation * Math.PI / 180);
			this.collider.update(this.x, this.y, this.r);

			// update eye
			this.eyes.forEach((eye, i)=>{
				let rot = (this.rotation+eye.angle) % 360;
				this.eyes[i].x = this.x + (this.eyeLen) * Math.cos(rot * Math.PI / 180);
				this.eyes[i].y = this.y + (this.eyeLen) * Math.sin(rot * Math.PI / 180);
				this.eyes[i].collider.update(this.eyes[i].x, this.eyes[i].y, null, null, this.x, this.y);
			});

			if(this.distance < bestUnit.distance || bestUnit === this || !bestUnit.alive)
			{
				bestUnit = this;
				this.drawBrain = true;
			}
			else
			{
				this.drawBrain = false;
			}
			
			this.ttc++;
			this.changedPosition++;
		}
    }
    draw()
    {
        if(this.alive && !this.win)
		{
			if(this.lastWinner)
			{
				ctx.fillStyle = "rgba(205,0,0,0.8)";
				ctx.strokeStyle = "white";
				ctx.lineWidth = 4;
			}
			else if(this.best)
			{
				ctx.fillStyle = "rgba(170,51,51,0.2)";
				ctx.strokeStyle = "rgba(0,0,255,0.5)";
				ctx.lineWidth = 4;
			}
			else
			{
				ctx.fillStyle = "rgba(170,51,51,0.2)";
				ctx.strokeStyle = "rgba(255,165,0,0.5)";
				ctx.lineWidth = 3;
			}
		}
		else if(this.win)
		{
			if(this.lastWinner || this.best)
				ctx.fillStyle = "rgba(204,102,0,0.9)";
			else
                ctx.fillStyle = "rgba(255,255,0,0.8)";
                
			ctx.strokeStyle = "rgba(0,0,0,0)";
			ctx.lineWidth = 3;
		}
		else
		{
			ctx.fillStyle = "rgba(119,85,85,0.1)";
			ctx.strokeStyle = "rgba(0,0,0,0)";
			ctx.lineWidth = 3;
		}
		ctx.beginPath();
		ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		let a = this.x + this.r * Math.cos(this.rotation * Math.PI / 180);
    	let b = this.y + this.r * Math.sin(this.rotation * Math.PI / 180);
		ctx.lineTo(a,b);
		ctx.stroke();

		if(false)
		{
			ctx.lineWidth = 1;
			this.eyes.forEach(eye=>{
				if(eye.triger == 0) ctx.strokeStyle = "rgb(255,255,0)";
				else ctx.strokeStyle = "rgb(255,0,0)";
				ctx.beginPath();
				ctx.moveTo(this.x,this.y);
				ctx.lineTo(eye.x, eye.y);
				ctx.stroke();
			});
		}
    }
}