class Edge {
  constructor(point1, point2) {
    this.p1 = point1;
    this.p2 = point2;
  }

  isEqual(e) {
    return ((this.p1.isEqual(e.p1) && this.p2.isEqual(e.p2)) || ((this.p1.isEqual(e.p2) && this.p2.isEqual(e.p1))));
  }
}