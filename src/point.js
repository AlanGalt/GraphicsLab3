class Point {
  constructor([x, y, z = 0]) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  isEqual(p) {
    return this.x === p.x && this.y === p.y && this.z === p.z;
  }
}