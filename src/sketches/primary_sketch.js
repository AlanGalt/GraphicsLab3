const primaryConfig = new Config({
  type: 'primary',
  projCenter: new Point([10, 7, 30]),
  coordDist: 0,
  psiX: 0,
  psiY: 0,
  e: 0.01,
  projectEntity(edge, projMatrix, s, e) {
    const p1 = edge.p1;
    const p2 = edge.p2;
    let vec1 = [p1.x, p1.y, p1.z, 1];
    let vec2 = [p2.x, p2.y, p2.z, 1];
    let h1 = 1 - p1.z / s.z;
    let h2 = 1 - p2.z / s.z;
    if (h1 > 0) {
      vec1 = math.multiply(vec1, projMatrix);
      vec1 = [
        Math.round(vec1[0] / vec1[3] * 100) / 100,
        Math.round(vec1[1] / vec1[3] * 100) / 100,
        Math.round(vec1[2] / vec1[3] * 100) / 100
      ];
    } 
    if (h2 > 0) {
      vec2 = math.multiply(vec2, projMatrix);
      vec2 = [
        Math.round(vec2[0] / vec2[3] * 100) / 100,
        Math.round(vec2[1] / vec2[3] * 100) / 100,
        Math.round(vec2[2] / vec2[3] * 100) / 100
      ];
    }
    if (h1 > 0 && h2 <= 0) {
      vec2 = [
        vec2[0] + (vec1[0]-vec2[0])*((1 - e)*s.z - vec2[2])/(vec1[2]-vec2[2]),
        vec2[1] + (vec1[1]-vec2[1])*((1 - e)*s.z - vec2[2])/(vec1[2]-vec2[2]),
        (1 - e)*s.z,
        1
      ];
      vec2 = math.multiply(vec2, projMatrix);
      vec2 = [
        Math.round(vec2[0] / vec2[3] * 100) / 100,
        Math.round(vec2[1] / vec2[3] * 100) / 100,
        Math.round(vec2[2] / vec2[3] * 100) / 100
      ];
    } else if (h2 > 0 && h1 <= 0) {
      vec1 = [
        vec1[0] + (vec2[0]-vec1[0])*((1 - e)*s.z - vec1[2])/(vec2[2]-vec1[2]),
        vec1[1] + (vec2[1]-vec1[1])*((1 - e)*s.z - vec1[2])/(vec2[2]-vec1[2]),
        (1 - e)*s.z,
        1
      ];
      vec1 = math.multiply(vec1, projMatrix);
      vec1 = [
        Math.round(vec1[0] / vec1[3] * 100) / 100,
        Math.round(vec1[1] / vec1[3] * 100) / 100,
        Math.round(vec1[2] / vec1[3] * 100) / 100
      ];
    } else if (h1 <= 0 && h2 <= 0) {
      return;
    }
    return new Edge(new Point(vec1), new Point(vec2));
  }, 
  toScreen(point) {
    const sX = (point.x * step + width / 2);
    const sY = (-point.y * step + height / 2) ;
    return new Point([sX, sY]);
  },
});


const primarySketch = new p5((p) => templateSketch(p, primaryConfig), canvasContainer);