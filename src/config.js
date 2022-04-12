//Added native multiplication functions
class Config {
  constructor(obj) {
    this.type = obj.type;
    this.projCenter = obj.projCenter;
    this.initCenter = obj.projCenter;
    this.coordDist = obj.coordDist;
    this.psiX = obj.psiX;
    this.psiY = obj.psiY;
    this.projMatrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ];
    this.e = obj.e;
    this.projectEntity = (entity) => obj.projectEntity(entity, this.frontProjection, this.projCenter, 
      this.e, this.rotationMatrix, this.transMatrix);
    this.toScreen = obj.toScreen;
    this.setProjectionMatrix();
  }

  setProjectionMatrix() {
    if (this.type != 'primary') return;
    this.rotate();
    this.translate();
    this.roundMatrix();
    if (!this.projCenter.z) {
      this.projMatrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.frontProjection = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      this.updateTable();
      return;
    }
    let cX = this.projCenter.x / this.projCenter.z;
    let cY = this.projCenter.y / this.projCenter.z;
    let cF = 1 / this.projCenter.z;
    this.frontProjection = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [-cX, -cY, 0, -cF],
      [0, 0, 0, 1],
    ];
    let aligned = matrixDot(this.rotationMatrix, this.transMatrix);
    this.projMatrix = matrixDot(aligned, this.frontProjection);
    this.roundMatrix();
    this.updateTable();
  }

  updateTable() {
    for (let i = 0; i < 16; i++) {
      let cell = document.getElementById(`cell${i}`);
      let row = Math.floor(i / 4);
      let col = i % 4;
      cell.value = this.projMatrix[row][col];
    }
  }

  translate() {
    this.transMatrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, -this.coordDist, 1],
    ];
    let vec = [this.projCenter.x, this.projCenter.y, this.projCenter.z, 1];
    vec = vectorMatrixDot(vec, this.transMatrix);
    this.projCenter = new Point(normalize(vec));
  }

  rotate() {
    let aX = radians(this.psiY);
    let aY = -Math.asin(Math.sin(radians(this.psiX))/Math.cos(radians(this.psiY)));
    this.rotationMatrix = [
      [Math.cos(aY), Math.sin(aY)*Math.sin(aX), -Math.cos(aX)*Math.sin(aY), 0],
      [0, Math.cos(aX), Math.sin(aX), 0],
      [Math.sin(aY), -Math.cos(aY)*Math.sin(aX), Math.cos(aX)*Math.cos(aY), 0],
      [0, 0, 0, 1],
    ];
    // console.log(this.rotationMatrix);
    let vec = [this.initCenter.x, this.initCenter.y, this.initCenter.z, 1];
    vec = vectorMatrixDot(vec, this.rotationMatrix);
    this.projCenter = new Point(normalize(vec));
  }

  roundMatrix() {
    for (let i = 0; i < this.projMatrix.length; i++) {
      for (let j = 0; j < this.projMatrix.length; j++) {
        this.projMatrix[i][j] = Math.round(this.projMatrix[i][j] * 100) / 100;
      }
    }
  }
};

normalize = (vec) => {
  return (
    [
      Math.round(vec[0] / vec[3] * 100) / 100,
      Math.round(vec[1] / vec[3] * 100) / 100,
      Math.round(vec[2] / vec[3] * 100) / 100
    ]
  );
}
