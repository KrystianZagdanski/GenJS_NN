function dot(arr1, arr2)
{
    if(arr1.length != arr2.length)
    {
        throw new Error("lenghts of arrays in dot() are diferent "+arr1.length+" "+arr2.length);
    }
    let result = 0;
    arr1.forEach((item, i)=>{
        result += item*arr2[i];
    });
    return result;
}

function sig(x)
{
    return 1/(1+Math.pow(Math.E, -x));
}

function ReLU(x)
{
    return Math.max(0, x);
}

function randFloat(min , max)
{
    return min + (max - min) * Math.random();
}

class Brain
{
    /**
     * @constructor
     * @param  {Array.<number>} arrLayers - [input, hidden,..., out]
     */
    constructor(arrLayers)
    {
        this.layers = arrLayers;
        this.biases = [];
        this.weights = [];
        this.model = {
            r: 15,
            d: 30,
            minSpace: 5,
            span: 100,
            offsetX: 15,
            offsetY: 15,
            neurons: [],
            connections: []
        };
    }
    /**
     * Initialize Network with given bises and weights or generate random
     * @param  {Array.<number>} biases
     * @param  {Array.<number>} weights
     */
    init(biases, weights)
    {
        let biasIndex = 0;
        let weightIndex = 0;
        let biggestLayer = Math.max.apply(null,this.layers);
        let size = biggestLayer*(this.model.d + this.model.minSpace) - this.model.minSpace;

        this.layers.forEach((layerSize, li)=>{
            this.model.neurons[li] = [];
            this.biases[li] = [];

            let x = this.model.offsetX + this.model.span * li;
            let y = this.model.offsetY;
            let space = (size - (layerSize*this.model.d))/layerSize+1;
            for(let bi = 0; bi < layerSize; bi++)
            {
                if(biases)
                    this.biases[li][bi] = biases[biasIndex++];
                else
                    this.biases[li][bi] = randFloat(-1, 1);

                y = this.model.offsetY + space/2 + (this.model.d+space)*(bi);
                this.model.neurons[li][bi] = {x: x, y: y, color: "rgb(0,0,0)"}
            }

            if(li == 0) return;
            this.model.connections[li-1] = [];
            this.weights[li] = [];
            for(let ci = 0; ci < layerSize; ci++)
            {
                this.model.connections[li-1][ci] = [];
                this.weights[li][ci] = [];
                for(let wi = 0; wi < this.layers[li-1]; wi++)
                {
                    if(weights)
                        this.weights[li][ci][wi] = weights[weightIndex++];
                    else
                        this.weights[li][ci][wi] = randFloat(-1, 1);

                    this.model.connections[li-1][ci][wi] = {
                        x: this.model.neurons[li-1][wi].x,
                        y: this.model.neurons[li-1][wi].y,
                        color: "rgb(0,0,0)",
                        x2: this.model.neurons[li][ci].x,
                        y2: this.model.neurons[li][ci].y
                    };
                    if(this.weights[li][ci][wi] > 0)
                        this.model.connections[li-1][ci][wi].color = "rgb(0,"+this.weights[li][ci][wi]*255+",0)";
                    else if(this.weights[li][ci][wi] < 0)
                        this.model.connections[li-1][ci][wi].color = "rgb("+this.weights[li][ci][wi]*(-255)+",0,0)";
                }
            }  
        });

    }

    getBiases()
    {
        let biasesList = [];
        this.biases.forEach(layer=>{
            layer.forEach(bias=>{
                biasesList.push(bias);
            });
        });
        return biasesList;
    }

    getWeights()
    {
        let weightsList = [];
        this.weights.forEach(layer=>{
            layer.forEach(neurons=>{
                neurons.forEach(weight=>{
                    weightsList.push(weight);
                });
            });
        });
        return weightsList;
    }

    neuron(inputs, bias, weights)
    {
        return sig(dot(inputs, weights) + bias);
    }

    feedForward(arrInputs, index)
    {
        let out = [];
        if(index == undefined)
        {
            for(let i = 0; i < this.biases[0].length; i++)
            {
                out[i] = arrInputs[i];// + this.biases[0][i];
                this.model.neurons[0][i].color = "rgb(0,"+255*out[i]+",0)";
            }
            return this.feedForward(out, 1);
        }
        for(let i = 0; i < this.biases[index].length; i++)
        {
            out[i] = this.neuron(arrInputs, this.biases[index][i], this.weights[index][i]);
            this.model.neurons[index][i].color = "rgb(0,"+255*out[i]+",0)";
        }

        if(index == this.layers.length-1)
        {
            return out;
        }
        else
            return this.feedForward(out, index+1);
    }

    draw(ctx, w, h)
    {
        ctx.fillStyle = "#666";
        ctx.fillRect(0, 0, w, h);

        this.model.connections.forEach(n=>{
            n.forEach(list=>{
                list.forEach(conn=>{
                    ctx.strokeStyle = conn.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(conn.x, conn.y);
                    ctx.lineTo(conn.x2, conn.y2);
                    ctx.stroke();
                });                
            });
        });

        this.model.neurons.forEach(list=>{
            list.forEach(n=>{
                ctx.fillStyle = n.color;
                ctx.beginPath();
                ctx.arc(n.x, n.y, this.model.r, 0, 2*Math.PI);
                ctx.fill();                              
            });
        });
    }

}
