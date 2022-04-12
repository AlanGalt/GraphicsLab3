const frontConfig = new Config({
  type: 'front',
  projCenter: new Point([0, 0, 10]),
  projectEntity(p) {
    return new Point([p.x, p.y, 0]);
  }, 
  toScreen(point) {
    let sX = (point.x * step + width / 2);
    let sY = (-point.y * step + height / 2) ;
    return new Point([sX, sY]);
  },
});

const frontSketch = new p5((p) => templateSketch(p, frontConfig), canvasContainer);