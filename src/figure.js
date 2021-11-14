class Figure {
  constructor() {
    this.edges = [];
    this.frontProjected = [];
    this.topProjected = [];
    this.rightProjected = [];
    this.primaryProjected = [];
  }

  project(projectEntity, type) {
    this[`${type}Projected`] = [];
    if(type != 'primary') {
      for (edge of this.edges) {
        let p1 = projectEntity(edge.p1);
        let p2 = projectEntity(edge.p2);
        if (p1 && p2) {
          this[`${type}Projected`].push(new Edge(p1, p2));
        }
      }
      this.removeDuplicates(type);
    } else {
      for (edge of this.edges) {
        const projected = projectEntity(edge);
        if (projected) {
          this[`${type}Projected`].push(projected);
        }
      }
    }
    
    // console.log(this[`${type}Projected`]);
  }

  removeDuplicates(type) {
    let res = [...this[`${type}Projected`]];
    let arr = [...this[`${type}Projected`]];
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].p1.isEqual(arr[i].p2)) {
        res.splice(i, 1);
        continue;
      }
      for (let j = i - 1; j >= 0; j--) {
        if (arr[i].isEqual(arr[j])) {
          res.splice(i, 1);
          break;
        }
      }
    }
    this[`${type}Projected`] = [...res];
  }
}