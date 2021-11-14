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


const sliders = document.querySelectorAll('[id$="angle"]');
const values = document.querySelectorAll('[id$="value"]');
for (let i = 0; i < 2; i++) {
  sliders[i].oninput = () => {
    values[i].textContent = sliders[i].value;
    setAngles(i);
  };
} 

function setAngles(i) {
  let curr = parseInt(sliders[i].value);
  let j = Number(!i);
  let other = parseInt(sliders[j].value);
  
  while ((Math.pow(Math.sin(radians(curr)), 2) + Math.pow(Math.sin(radians(other)), 2)) > 1) { 
    other--;
    sliders[j].value = other;
    values[j].textContent = other;
  }
  let zAngle = degrees(Math.asin(Math.sqrt(Math.round((1 - Math.pow(Math.sin(radians(curr)), 2) - Math.pow(Math.sin(radians(other)), 2)) * 1000) / 1000)));
  document.getElementById('z-val').value = Math.round(zAngle);

  primarySketch.config.psiX = parseInt(sliders[0].value);
  primarySketch.config.psiY = parseInt(sliders[1].value);
  primarySketch.config.psiZ = Math.round(zAngle);
  primarySketch.config.setProjectionMatrix();
  primarySketch.project();
}

function radians(angle) {
  return angle * (Math.PI / 180);
}

function degrees(angle) {
  return angle * (180 / Math.PI);
}

