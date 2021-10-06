const templateSketch = function(p) {
  p.setup = function() {
    p.createCanvas(400, 400);
  }

  p.draw = function() {
    p.background(220);
  }
}

const canvasContainer = document.getElementById("canvas-container");

const topSketch = new p5(templateSketch, canvasContainer);
const primarySketch = new p5(templateSketch, canvasContainer);
const frontSketch = new p5(templateSketch, canvasContainer);
const rightSketch = new p5(templateSketch, canvasContainer);