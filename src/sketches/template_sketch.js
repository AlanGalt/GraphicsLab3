const templateSketch = function(p, config) {
  p.config = config;

  p.setup = function() {
    p.createCanvas(width, height);
  };

  p.draw = function() {
    p.background(250);
    p.drawGrid();
    p.drawAxis();
    p.drawScale();
    p.drawFigure();
  };

  p.drawFigure = function() {
    p.push();
    for (edge of figure[`${p.config.type}Projected`]) {
      let p1 = p.config.toScreen(edge.p1);
      let p2 = p.config.toScreen(edge.p2);
      p.line(p1.x, p1.y, p2.x, p2.y);
    }
    if (p.config.type != 'primary') {
      let s = p.config.projectEntity(p.config.projCenter);
      s = p.config.toScreen(s);
      p.fill(224, 61, 80);
      p.ellipse(s.x, s.y, 8);
    }
    p.pop();
  };

  p.project = function() {
    figure.project(p.config.projectEntity, p.config.type);
  }

  p.drawGrid = function () {
    if (p.config.type === "primary") return;
    p.push();
    p.stroke(186);
    p.strokeWeight(1);
    for (let i = 0; i < width; i += step) {
      if (i === width / 2) continue;
      p.line(i, 0, i, height);
    }

    for (let i = height / 2; i < height; i += step) {
      p.line(0, i, width, i);
      p.line(0, height - i, width, height - i);
    }
    p.pop();
  };

  p.drawAxis = function() {
    p.push();
    p.textSize(17);
    if (p.config.type != "primary") {
      p.line(0, height / 2, width, height / 2);
      p.line(width / 2, height, width / 2, 0);
      if (p.config.type === "front") {
        p.text("x", width - 10, height / 2 - 7);
        p.text("y", width / 2 - 16, 10);
        p.line(width, height / 2, width - 8, height / 2 - 5);
        p.line(width, height / 2, width - 8, height / 2 + 5);
        p.line(width / 2, 0, width / 2 - 5, 8);
        p.line(width / 2, 0, width / 2 + 5, 8);
      } else if (p.config.type === "top") {
        p.text("x", width - 10, height / 2 - 7);
        p.text("z", width / 2 - 16, height - 5);
        p.line(width, height / 2, width - 8, height / 2 - 5);
        p.line(width, height / 2, width - 8, height / 2 + 5);
        p.line(width / 2, height, width / 2 - 5, height - 8);
        p.line(width / 2, height, width / 2 + 5, height - 8);
      } else {
        p.text("z", 2, height / 2 - 7);
        p.text("y", width / 2 - 16, 15);
        p.line(0, height / 2, 8, height / 2 - 5);
        p.line(0, height / 2, 8, height / 2 + 5);
        p.line(width / 2, 0, width / 2 - 5, 8);
        p.line(width / 2, 0, width / 2 + 5, 8);
      }
    } else {
      let xAxis = new Edge(new Point([-14, 0, 0]), new Point([14, 0, 0]));
      let yAxis = new Edge(new Point([0, -9, 0]), new Point([0, 9, 0]));
      let zAxis = new Edge(new Point([0, 0, -14]), new Point([0, 0, 14]));
      xAxis = p.config.projectEntity(xAxis, p.config.projMatrix, p.config.projCenter, p.config.e);
      yAxis = p.config.projectEntity(yAxis, p.config.projMatrix, p.config.projCenter, p.config.e);
      zAxis = p.config.projectEntity(zAxis, p.config.projMatrix, p.config.projCenter, p.config.e);
      for (edge of [xAxis, yAxis, zAxis]) {
        if (edge) {
          let p1 = p.config.toScreen(edge.p1);
          let p2 = p.config.toScreen(edge.p2);
          p.line(p1.x, p1.y, p2.x, p2.y);
        }
      }

      let xArrow1 = new Edge(new Point([14, 0, 0]), new Point([13.5, 0, 0.3]));
      let xArrow2 = new Edge(new Point([14, 0, 0]), new Point([13.5, 0, -0.3]));
      let yArrow1 = new Edge(new Point([0, 9, 0]), new Point([0.3, 8.5, 0]));
      let yArrow2 = new Edge(new Point([0, 9, 0]), new Point([-0.3, 8.5, 0]));
      let zArrow1 = new Edge(new Point([0, 0, 14]), new Point([0.3, 0, 13.5]));
      let zArrow2 = new Edge(new Point([0, 0, 14]), new Point([-0.3, 0, 13.5]));
      for (edge of [xArrow1, xArrow2, yArrow1, yArrow2, zArrow1, zArrow2]) {
        let projected = p.config.projectEntity(edge, p.config.projMatrix, p.config.projCenter, p.config.e);
        if (projected) {
          let p1 = p.config.toScreen(projected.p1);
          let p2 = p.config.toScreen(projected.p2);
          p.line(p1.x, p1.y, p2.x, p2.y);
        } 
      }
      
      let xLabel = p.config.toScreen(xAxis.p2);
      let yLabel = p.config.toScreen(yAxis.p2);
      let zLabel = p.config.toScreen(zAxis.p2);
      p.text('x', xLabel.x, xLabel.y - 5);
      p.text('y', yLabel.x + 5, yLabel.y);
      p.text('z', zLabel.x - 12, zLabel.y - 6);
      // p.text('o', width / 2 + 3, height / 2 - 3);
    }
    p.pop();
  };

  p.drawScale = function() {
    p.push();
    if (p.config.type != "primary") {
      for (let i = step; i < width; i += step) {
        if (i == width / 2) continue;
        p.line(i, height / 2 - 5, i, height / 2 + 5);
      }
      for (let i = height / 2 + step; i < height; i += step) {
        p.line(width / 2 - 5, i, width / 2 + 5, i);
        p.line(width / 2 - 5, height - i, width / 2 + 5, height - i);
      }
      p.stroke(224, 61, 80);
      p.fill(224, 61, 80);
      p.noStroke();
      p.text("0", width / 2 + 4, height / 2 + 14)
      if (p.config.type === "front" || p.config.type === "top") {
        for (let i = width / 2; i < width; i += step) {
          if (i/step - width / 2 / step) {
            p.text(`${i/step - width / 2 / step}`, i + 2, height / 2 + 14);
            p.text(`${-(i/step - width / 2 / step)}`, width - i - 3, height / 2 + 14);
          }  
        }
      }
      if (p.config.type === "front" || p.config.type === 'right') {
        for (let i = height / 2; i < height; i += step) {
          if (i/step - height / 2 / step) {
            p.text(`${-(i - height / 2) / step}`, width / 2 + 7, i + 10);
            p.text(`${(i - height / 2) / step}`, width / 2 + 10, height - i + 10);
          }  
        }
      }
      if (p.config.type === "top") {
        for (let i = height / 2; i < height; i += step) {
          if (i/step - height / 2 / step) {
            p.text(`${(i - height / 2) / step}`, width / 2 + 10, i + 10);
            p.text(`${-(i - height / 2) / step}`, width / 2 + 7, height - i + 10);
          }  
        }
      }
      if (p.config.type === "right") {
        for (let i = width / 2; i < width; i += step) {
          if (i/step - width / 2 / step) {
            p.text(`${-(i/step - width / 2 / step)}`, i + 2, height / 2 + 14);
            p.text(`${i/step - width / 2 / step}`, width - i, height / 2 + 14);
          }  
        }
      }
    }
    p.pop();
  };
}