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
    this.projectEntity = (entity) => obj.projectEntity(entity, this.projMatrix, this.projCenter, this.e);
    this.toScreen = obj.toScreen;
    this.setProjectionMatrix();
  }

  setProjectionMatrix() {
    if (this.type != 'primary') return;
    this.rotate();
    this.roundMatrix();
    this.translate();
    let cX = this.projCenter.x / this.projCenter.z;
    let cY = this.projCenter.y / this.projCenter.z;
    let cF = 1 / this.projCenter.z;
    let frontProjection = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [-cX, -cY, 0, -cF],
      [0, 0, 0, 1],
    ];
    let aligned = math.multiply(this.rotationMatrix, this.transMatrix);
    this.projMatrix = math.multiply(aligned, frontProjection);
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
    vec = math.multiply(vec, this.transMatrix);
    this.projCenter = new Point([
      Math.round(vec[0] * 100) / 100, 
      Math.round(vec[1] * 100) / 100, 
      Math.round(vec[2] * 100) / 100]);
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
    let vec = [this.initCenter.x, this.initCenter.y, this.initCenter.z, 1];
    vec = math.multiply(vec, this.rotationMatrix);
    this.projCenter = new Point([
      Math.round(vec[0] * 100) / 100, 
      Math.round(vec[1] * 100) / 100, 
      Math.round(vec[2] * 100) / 100]);
  }

  roundMatrix() {
    for (let i = 0; i < this.projMatrix.length; i++) {
      for (let j = 0; j < this.projMatrix.length; j++) {
        this.projMatrix[i][j] = Math.round(this.projMatrix[i][j] * 100) / 100;
      }
    }
  }
};