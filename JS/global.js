const canvasW = 1200;
const canvasH = 700;
const POPULATION_SIZE = 1000;

let canvas = document.getElementById("canvas");
canvas.width = canvasW;
canvas.height = canvasH;
let ctx = canvas.getContext("2d");
let nnCanvas = document.getElementById("nnCanvas");
nnCanvas.style.backgroundColor = "gray";
nnCanvas.width = canvasW;
nnCanvas.height = canvasH;
let nnCtx = nnCanvas.getContext("2d");

let score = 0; // number of units that completed task (now)
let lastScore = 0; // -||- generation before
let bestScore = 0;
let bestTime = 1000; // best time in witch task was complete
let mutation = 0; // % of mutation it curent population
let firstGoal = -1; // first generation when task was completed
let above50 = -1; // 50% of population complete task
let above80 = -1; // 80% of population coplete task
let bestUnit;