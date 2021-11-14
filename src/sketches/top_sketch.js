const topConfig = new Config({
  type: 'top',
  projCenter: new Point([10, 7, 30]),
  projectEntity(p) {
    return new Point([p.x, 0, p.z]);
  }, 
  toScreen(point) {
    let sX = (point.x * step + width / 2);
    let sY = (point.z * step + height / 2) ;
    return new Point([sX, sY]);
  },
});


const topSketch = new p5((p) => templateSketch(p, topConfig), canvasContainer);