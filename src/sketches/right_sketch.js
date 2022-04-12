const rightConfig = new Config({
  type: 'right',
  projCenter: new Point([0, 0, 10]),
  projectEntity(p) {
    return new Point([0, p.y, p.z]);
  }, 
  toScreen(point) {
    let sX = (-point.z * step + width / 2);
    let sY = (-point.y * step + height / 2) ;
    return new Point([sX, sY]);
  },
});

const rightSketch = new p5((p) => templateSketch(p, rightConfig), canvasContainer);