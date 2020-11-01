class Collider
{
    constructor(x, y, w, h, x2, y2, len)
    {
        this.x = x;
        this.y = y;
        this.x2 = x2 || 0;
        this.y2 = y2 || 0;
        if(h)
        {
            this.w = w;
            this.h = h;
            this.type = "squer";
        }
        else if (w)
        {
            this.r = w;
            this.type = "circle";
        }
        else
        {
            this.len = len;
            this.type = "point";
        }
    }
    update(x, y, w, h, x2, y2)
    {
        this.x = x;
        this.y = y;
        if(h)
        {
            this.w = w;
            this.h = h;
        }
        else if (w)
        {
            this.r = w;
            this.type = "circle";
        }
        else
        {
            this.x2 = x2;
            this.y2 = y2;
            this.type = "point";
        }
    }
    /* 
        Check for colision
    */
    colideWith(other)
    {
        if(this.type == "circle")
        {
            if(this.type == other.collider.type)
            {
                let dx = this.x - other.x;
                let dy = this.y - other.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                return distance <= this.r + other.r;
            }
            else // this circle, other squer
            {
                let deltaX = this.x - Math.max(other.x, Math.min(this.x, other.x + other.w));
                let deltaY = this.y - Math.max(other.y, Math.min(this.y, other.y + other.h));
                return (deltaX * deltaX + deltaY * deltaY) < (this.r * this.r);
            }
        }
        else if(this.type == "point")
        {
            if(other.collider.type == "circle") // circle
            {
                // transposes coordinates to reference circle at x0 y0
                let x = this.x2 - other.x,
                y = this.y2 - other.y,
                x2 = this.x - other.x,
                y2 = this.y - other.y;

                // calculate Delata
                let dx = x2 - x;
                let dy = y2 - y;
                let dr = Math.sqrt((dx*dx) + (dy*dy));
                let D = x*y2 - x2*y;
                let del = (other.r*other.r)*(dr*dr)-(D*D);
                if(del >= 0)
                {
                    // find cross point coordinates
                    let sgn = dy < 0? -1:1;
                    let px, py;

                    if(y > y2)
                    {
                        px = ( D*dy + sgn*dx*Math.sqrt(del) )/( dr*dr );
                        py = ( -D*dx + Math.sqrt(dy*dy)*Math.sqrt(del) )/( dr*dr );
                    }
                    else
                    {
                        px = ( D*dy - sgn*dx*Math.sqrt(del) )/( dr*dr );
                        py = ( -D*dx - Math.sqrt(dy*dy)*Math.sqrt(del) )/( dr*dr );
                    }
                    
                    // calculate distance between start, point and end
                    let distance = Distance({x: x, y: y}, {x: px, y: py});
                    let distanceSum = distance + Distance({x: x2, y: y2}, {x: px, y: py});
                    if(distanceSum == this.len)
                    {
                        return 1-distance/this.len;
                    }     
                }
                return 0;
            }
            else if(other.collider.type == "squer") // squer
            {
                let left = other.x;
                let right = other.x + other.w;
                let top = other.y;
                let bottom = other.y + other.h;

                let t, u;
                let shortestDistance = this.len+1;
                let x1 = this.x2,
                x2 = this.x,
                y1 = this.y2,
                y2 = this.y;

                let sides = [[left,left,top,bottom], [right,right,top,bottom], [left,right,top,top], [left,right,bottom,bottom]];
                for(let side = 0; side < 4; side++)
                {
                    let x3 = sides[side][0],
                    x4 = sides[side][1],
                    y3 = sides[side][2],
                    y4 = sides[side][3];
                    
                    t = ( (x1-x3)*(y3-y4) - (y1-y3)*(x3-x4) )/( (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4) );
                    u = -( (x1-x2)*(y1-y3) - (y1-y2)*(x1-x3) )/( (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4) );

                    if(t >= 0 && t <= 1)
                    {
                        let px = x1 + t*(x2 - x1);
                        let py = y1 + t*(y2 - y1);
                        let d = Distance({x: x1, y: y1}, {x: px, y:py});
                        if(side == 0)
                        {
                            shortestDistance = d;
                        }
                        else if(d < shortestDistance)
                        {
                            shortestDistance = d;
                        }
                    }
                }
                if(shortestDistance != this.len+1)
                {
                    return 1-shortestDistance/this.len;
                }
                return 0;
                
            }
            else
            {
                return 0;
            }
        }
        else
        {
            if(this.type == other.collider.type) // this squer, other squer
            {
                let collisionX = rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x;
                let collisionY = rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y;
                return collisionX && collisionY;
            }
            else // this squer, oter circle
            {
                let deltaX = other.x - Math.max(this.x, Math.min(other.x, this.x + this.w));
                let deltaY = other.y - Math.max(this.y, Math.min(other.y, this.y + this.h));
                return (deltaX * deltaX + deltaY * deltaY) < (other.r * other.r);
            }
        }
    }

}