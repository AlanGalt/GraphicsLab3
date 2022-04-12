const width = 600;
const height = 390;
const step = 20;
const canvasContainer = document.getElementById('canvas-container');
const fileInput = document.getElementById('file-input');
let figure = new Figure();

fileInput.onchange = e => {
  const file = e.target.files[0]; 
  const reader = new FileReader();
  reader.readAsText(file, 'UTF-8');
  reader.onload = readerEvent => {
    const content = JSON.parse(readerEvent.target.result);
    figure = new Figure();
    for (edge of content.edges) {
      let point1 = new Point(edge[0]);
      let point2 = new Point(edge[1]);
      figure.edges.push(new Edge(point1, point2));
    }
    frontSketch.project();
    rightSketch.project();
    topSketch.project();
    primarySketch.project();
  }
};


for (let i = 0; i < 16; i++) { // handle matrix changes
  let cell = document.getElementById(`cell${i}`);
  let row = Math.floor(i / 4);
  let col = i % 4;
  cell.onchange = () => {
    primarySketch.config.projMatrix[row][col] = parseFloat(cell.value);
    primarySketch.project();
  };
}


const angles = document.querySelectorAll('[id$="angle"]');
const values = document.querySelectorAll('[id$="value"]');
for (let i = 0; i < 2; i++) {
  angles[i].oninput = () => {
    values[i].textContent = angles[i].value;
    setAngles(i);
  };
} 

const coords = document.querySelectorAll('[id$="coord"]');
const coordVals = document.querySelectorAll('[id$="coord-val"]');
for (let i = 0; i < 3; i++) {
  coords[i].oninput = () => {
    coordVals[i].textContent = coords[i].value;
    setCoords();
  };
} 

const dist = document.getElementById('dist');
dist.oninput = () => {
  document.getElementById('dist-val').textContent = dist.value;
  primarySketch.config.coordDist = parseInt(dist.value);
  primarySketch.config.setProjectionMatrix();
  primarySketch.project();
}; 

const steps = document.querySelectorAll('[id$="step"]');
let timerId = 0;
for (let i = 0; i < 6; i++) {
  let elem = document.getElementById(`${steps[i].id.substring(0, steps[i].id.length-5)}`);
  steps[i].onchange = () => {
    if (steps[i].value === 0) {
      return;
    }
    if (timerId != 0) clearTimeout(timerId);
    timerId = setTimeout(tick = () => {
      if (parseInt(elem.value) >= parseInt(elem.min) 
      && parseInt(elem.value) <= parseInt(elem.max) && parseInt(steps[i].value)) {
        elem.value = parseInt(elem.value) + parseInt(steps[i].value);
        elem.oninput();
        timerId = setTimeout(tick, 750);
      } else {
        timerId = 0;
        clearTimeout(timerId);
      }
    }, 1000);
  }
}

function setAngles(i) {
  let curr = parseInt(angles[i].value);
  let j = Number(!i);
  let other = parseInt(angles[j].value);
  
  while ((Math.pow(Math.sin(radians(curr)), 2) + Math.pow(Math.sin(radians(other)), 2)) > 1) { 
    other--;
    angles[j].value = other;
    values[j].textContent = other;
  }
  let zAngle = degrees(Math.asin(Math.sqrt(Math.round((1 - Math.pow(Math.sin(radians(curr)), 2) - Math.pow(Math.sin(radians(other)), 2)) * 1000) / 1000)));
  document.getElementById('z-val').value = Math.round(zAngle);

  primarySketch.config.psiX = parseInt(angles[0].value);
  primarySketch.config.psiY = parseInt(angles[1].value);
  primarySketch.config.psiZ = Math.round(zAngle);
  primarySketch.config.setProjectionMatrix();
  primarySketch.project();
}

function setCoords() {
  primarySketch.config.initCenter.x = parseInt(coords[0].value);
  primarySketch.config.initCenter.y = parseInt(coords[1].value);
  primarySketch.config.initCenter.z = parseInt(coords[2].value);

  topSketch.config.projCenter.x = parseInt(coords[0].value);
  topSketch.config.projCenter.y = parseInt(coords[1].value);
  topSketch.config.projCenter.z = parseInt(coords[2].value);

  rightSketch.config.projCenter.x = parseInt(coords[0].value);
  rightSketch.config.projCenter.y = parseInt(coords[1].value);
  rightSketch.config.projCenter.z = parseInt(coords[2].value);

  frontSketch.config.projCenter.x = parseInt(coords[0].value);
  frontSketch.config.projCenter.y = parseInt(coords[1].value);
  frontSketch.config.projCenter.z = parseInt(coords[2].value);

  primarySketch.config.setProjectionMatrix();
  primarySketch.project();
}

function radians(angle) {
  return angle * (Math.PI / 180);
}

function degrees(angle) {
  return angle * (180 / Math.PI);
}

function matrixDot (A, B) {
  const result = new Array(A.length).fill(0).map(row => new Array(B[0].length).fill(0));
  return result.map((row, i) => {
    return row.map((val, j) => {
      return A[i].reduce((sum, elm, k) => sum + (elm*B[k][j]), 0);
    });
  });
}

function vectorMatrixDot(V, M) {
  const result = new Array(V.length).fill(0);
  for (let i = 0; i < M.length; i++) {
    for (let j = 0; j < M[0].length; j++) {
      result[i] += (M[j][i]*V[j]);
    }
  }
  return result;
}
