class Population
{
    constructor()
    {
        this.units = Array(POPULATION_SIZE);
        this.newUnits = [];
        this.createPopulation();
    }
    /*
        Create single unit with specify dna
    */
    createUnit(winer,best, dna)
    {
        this.newUnits.push(new Unit(startPoint.x, startPoint.y, 10, dna));

        if(winer)
            this.newUnits[this.newUnits.length-1].lastWinner = true;
        if(best)
            this.newUnits[this.newUnits.length-1].best = true;
    }
    /*
        Create whole new population with random dna
    */
    createPopulation()
    {
        for(let i = 0; i < POPULATION_SIZE; i++)
        {
            this.units[i] = new Unit(startPoint.x, startPoint.y, 10);
            alive += 1; // alive units counter
        }
        bestUnit = this.units[0];
    }
    /*
        Calculate and add fitness score to all units
    */
    calculateFitness()
    {
        for(let i = 0; i < this.units.length; i++)
        {
            let fitness = 0;
            let score = Distance(startPoint, target);

            fitness += (score - this.units[i].distance) * 0.7;
            fitness += (score - this.units[i].bestDistance);

            if(this.units[i].bestDistance <= score/4)
                fitness += 100;

            if(this.units[i].bestDistance <= score/2)
                fitness += 200;

            if(this.units[i].bestDistance <= score/4*3)
                fitness += 300;

            fitness += this.units[i].ttc * 0.05;

            if(!this.units[i].alive)
                fitness -= 50;

            if(this.units[i].win)
            {
                fitness += TIME - this.units[i].ttc*0.1;
                fitness += 500;
            }

            if(fitness < 0)
                fitness = 0;

            this.units[i].fitness = fitness;
        }
    }
    /*
        Sort units from best to worst depends on fitness
    */
    sort()
    {
        this.units.sort(function(a, b){
            if (a.fitness > b.fitness)
                return -1;
            else if (a.fitness < b.fitness)
                return 1;
            else
                return 0;
        });
    }
    /* 
        Rewrite best 15% of population
    */
    rewrite()
    {
        let x = 0;
        this.newUnits = [];

        while(this.newUnits.length < Math.round(POPULATION_SIZE * 0.15))
        {
            let win = this.units[x].win,
                best = !win,
                dna = [];
            dna[0] = this.units[x].brain.getBiases();
            dna[1] = this.units[x].brain.getWeights();
            this.createUnit(win, best, dna);
            x++;
        }
    }
    /* 
        Select and return index of Unit
    */
    select()
    {
        let unitIndex = 0;
        let fitnessSum = 0;
        // calculate max fitness
        for(let a = 0; a < this.units.length; a++)
        {
            fitnessSum += this.units[a].fitness;
        }

        while(unitIndex < this.units.length-2)
        {
            // select random weighted index
            if(Rand(0, fitnessSum) < this.units[unitIndex].fitness)
            {
                return unitIndex;
            }

            fitnessSum -= this.units[unitIndex++].fitness;
        }
        return unitIndex;
        
    }
    /* 
        Create new Units from selected parents
    */
    crossover()
    {
        while(this.newUnits.length < POPULATION_SIZE)
        {
            let unit1, unit2;
            let newDna = [];
            let s1 = this.select(), s2 = this.select();
            unit1 = this.units[s1];
            unit2 = this.units[s2];

            if(unit1 === unit2)
                continue;

            //new
            let dnaA = [];
            let dnaB = [];
            dnaA[0] = unit1.brain.getWeights();
            dnaA[1] = unit1.brain.getBiases();
            dnaB[0] = unit1.brain.getWeights();
            dnaB[1] = unit1.brain.getBiases();
            let crossPoint = Rand(1, dnaA[0].length-1);
            let crossPoint2 = Rand(1, dnaA[1].length-1);

            newDna[0] = dnaA[0].slice(0,crossPoint);
            newDna[0] = newDna[0].concat(dnaA[0].slice(crossPoint, dnaA[0].length));

            newDna[1] = dnaA[1].slice(0,crossPoint2);
            newDna[1] = newDna[1].concat(dnaA[1].slice(crossPoint2, dnaA[1].length));

            // weights
            // newDna[0] = [];
            // newDna[1] = [];
            // for(let i = 0; i < dnaA[0].length; i++)
            // {
            //     let difr = Math.sqrt(Math.pow(dnaA[0][i], 2) - Math.pow(dnaB[0][i], 2));
            //     newDna[0].push((dnaA[0][i] + (difr*0.6))/1.6);
            // }
            // // biases
            // for(let i = 0; i < dnaA[1].length; i++)
            // {
            //     let difr = Math.sqrt(Math.pow(dnaA[1][i],2 ) - Math.pow(dnaB[1][i], 2));
            //     newDna[1].push((dnaA[1][i] + (difr*0.6))/1.6);
            // }

            this.createUnit(false, false, [newDna[1], newDna[0]]);

        }
    }
    /* 
        Mutate fiew Units in new population
    */
    mutate()
    {
        let m = 0, r, lvl;
        for(let i = 0; i < POPULATION_SIZE; i++)
        {
            r = Math.random();
            if(r > 0.92)
            {
                //lvl = Rand(1,5); // change 1 - 4 parts of DNA
                let dna = [];
                dna[0] = this.newUnits[i].brain.getWeights();
                dna[1] = this.newUnits[i].brain.getBiases();
                let len = dna[0].length;
                lvl = Rand(Math.round(len * 0.01), Math.round(len * 0.15));
                while(0 < lvl)
                {
                    dna[0][Rand(0,len)] = RandFloat(-1, 1);
                    lvl--;
                }
                len = dna[1].length;
                lvl = Rand(Math.round(len * 0.05), Math.round(len * 0.15));
                while(0 < lvl)
                {
                    dna[1][Rand(0,len)] = RandFloat(-1, 1);
                    lvl--;
                }
                this.newUnits[i].brain.init(dna[1], dna[0]);
                m++; // mutation rate couter
            }
        }
        //this.newUnits[this.newUnits.length-1].drawBrain = true;
        this.newUnits[0].drawBrain = true;
        mutation = Math.round((m/POPULATION_SIZE)*100);
    }
    
    applyNewPopulation()
    {
        this.units = Object.assign([],this.newUnits);
        bestUnit = this.units[0];
        this.newUnits = [];
    }
}