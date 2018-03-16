const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const image = document.getElementById('source');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// CONTENT PICS -> 25 - 5 
if(window.Worker) {
  var webworker = new Worker('worker.js');

  const select = document.getElementById("select");
  const form = document.forms[0];
  const areas = document.getElementById("areas");
  const strokes = document.getElementById("strokes");

  areas.onchange = () => {
    areaAmount = parseInt(areas.value);
    draw({areaAmount});
  }
  strokes.onchange = () => {
    strokeAmount = parseInt(strokes.value);
    draw({strokeAmount});
  }
  
  select.onchange = () => {
    filter = select.value;
    draw({filter});
   }

   function draw({areaAmount = parseInt(areas.value) || 1, strokeAmount = parseInt(strokes.value) || 1, filter = select.value}) {
    const areaWidth = Math.ceil(canvas.width / areaAmount);
    const strokeWidth = Math.ceil(areaWidth / strokeAmount);

    console.log(areaAmount, strokeAmount);
    webworker.postMessage([areaAmount, areaWidth, strokeAmount, strokeWidth, canvas.width, canvas.height, imgData, filter]);
   }

   webworker.onmessage = ({ data }) => {
    const [ imgData, x, y ] = [ ...data ];
    ctx.putImageData(imgData, x, y);
  }
}