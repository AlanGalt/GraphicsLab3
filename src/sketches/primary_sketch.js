const primaryConfig = new Config({
  type: 'primary',
  projCenter: new Point([0, 0, 10]),
  coordDist: 0,
  psiX: 0,
  psiY: 0,
  e: 0.01,
  projectEntity(edge, projMatrix, s, e, rotationMatrix, transMatrix) {
    if (isZeroMatrix(projMatrix)) return;
    const p1 = edge.p1;
    const p2 = edge.p2;
    let vec1 = [p1.x, p1.y, p1.z, 1];
    let vec2 = [p2.x, p2.y, p2.z, 1];
    let aligned = matrixDot(rotationMatrix, transMatrix);
    vec1 = vectorMatrixDot(vec1, aligned);
    vec2 = vectorMatrixDot(vec2, aligned);

    const h1 = 1 - vec1[2] / s.z;
    const h2 = 1 - vec2[2] / s.z;
    if (h1 <= 0 && h2 <= 0) return;
    if (h1 > 0 && h2 <= 0) {
      // console.log(`2: ${vec1}, ${vec2}`);
      vec2 = [
        vec2[0] + ((vec2[0]-vec1[0])*((1 - e)*s.z - vec2[2]))/(vec2[2]-vec1[2]),
        vec2[1] + ((vec2[0]-vec2[0])*((1 - e)*s.z - vec2[2]))/(vec2[2]-vec1[2]),
        (1 - e)*s.z,
        1
      ];
      // console.log(`${vec1}, ${vec2}`);
    } else if (h2 > 0 && h1 <= 0) { 
      // console.log(`1: ${vec1}, ${vec2}`);
      vec1 = [
        vec1[0] + ((vec2[0]-vec1[0])*((1 - e)*s.z - vec1[2]))/(vec2[2]-vec1[2]),
        vec1[1] + ((vec2[1]-vec1[1])*((1 - e)*s.z - vec1[2]))/(vec2[2]-vec1[2]),
        (1 - e)*s.z,
        1
      ];
      // console.log(`${vec1}, ${vec2}`);
    }
    vec1 = vectorMatrixDot(vec1, projMatrix);
    vec2 = vectorMatrixDot(vec2, projMatrix);
     
    vec1 = normalize(vec1);
    vec2 = normalize(vec2);

    return new Edge(new Point(vec1), new Point(vec2));
  }, 
  toScreen(point) {
    const sX = (point.x * step + width / 2);
    const sY = (-point.y * step + height / 2) ;
    return new Point([sX, sY]);
  }
});

isZeroMatrix = (matrix) => {
  for (let row = 0; row <  matrix?.length; row++) {
    for (let col = 0; col < matrix[row]?.length; row++) {
      if (matrix[row][col] != 0) return false;
    }
  }
  return true;
}



const primarySketch = new p5((p) => templateSketch(p, primaryConfig), canvasContainer);
