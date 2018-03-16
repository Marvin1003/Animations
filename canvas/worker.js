onmessage = unsort;
// areaAmount, areaWidth, strokeAmount, strokeWidth, width, height, imgData
function unsort({data}) {
  const [
    areaAmount, 
    areaWidth, 
    strokeAmount, 
    strokeWidth,
    width, 
    height, 
    imgData,
    filter
  ] = [...data];

  let currentArea = 0;
  let pixel;
  
  const strokeArr = new Array(areaAmount);
  for(let i = 0; i < strokeArr.length; i++) {
    strokeArr[i] = new Array(strokeAmount);
    for(let j = 0; j < strokeArr[i].length; j++) {
      strokeArr[i][j] = [];
    }
  }
  
  // ITERATE OVER AREAS
  for(let a = 0; a < (areaAmount * areaWidth) * 4; a += areaWidth * 4) {
    let currentStroke = 0;
    // ITERATE OVER STROKES IN AN AREAS 
    for(let b = a; b < (( strokeWidth * strokeAmount ) * 4) + a; b += strokeWidth * 4) {
      // ITERATE STROKE VERTICALLY 
      for(let y = 0; y < (width * height) * 4; y += width * 4) {
        // ITERATE STROKE HORIZONTALLY 
        for(let x = 0; x < strokeWidth * 4; x += 4) {
          // ITERATE RGBA VALUES
          switch(filter) {
            case "grayscale":
              pixel = b + x + y;
              const grayscale =
                Math.abs(parseInt(((imgData.data[pixel] + imgData.data[pixel + 1] + imgData.data[pixel + 2]) / 3)));
              for(let c = 0; c < 3; c++)
                strokeArr[currentArea][currentStroke].push(grayscale);
              strokeArr[currentArea][currentStroke].push(255);
              break;
            case "grayscaleInverted":
              pixel = b + x + y;
              const grayscaleInverted =
                Math.abs(parseInt(((imgData.data[pixel] + imgData.data[pixel + 1] + imgData.data[pixel + 2]) / 3) - 255));
                for(let c = 0; c < 3; c++)
                  strokeArr[currentArea][currentStroke].push(grayscaleInverted);
                strokeArr[currentArea][currentStroke].push(255);
              break;
            default:
              for(let c = 0; c < 4; c++) {
                pixel = b + x + y + c;
                strokeArr[currentArea][currentStroke].push(imgData.data[pixel]);
              }
          }
        }
      }
      currentStroke++;
    }
    currentArea++;
  }
  
  let sortedAreas = createSortedArray(areaAmount);

  for(let j = 0; j < areaAmount; j++) {
    let sortedStrokes = createSortedArray(strokeAmount);
    let random1 = randomStroke(sortedAreas);
    for(let i = 0; i < strokeAmount; i++) {
      let random = randomStroke(sortedStrokes);
      console.log(strokeArr);
      var arr = new Uint8ClampedArray(strokeArr[j][i]);
      var newImageData = new ImageData(arr, strokeWidth, height);
      postMessage([newImageData, (random1 * areaWidth) + (strokeWidth * random)]);
    }
  } 
  
  function createSortedArray(length) {
    const sortedArray = new Array(length);
    for(let i = 0; i < length; i++)
      sortedArray[i] = i;
    return sortedArray;
  }

  function randomStroke(sorted) {
    let index = parseInt(Math.random() * sorted.length);
    let value = sorted[index];
    sorted.splice(index, 1);
    return value;
  }
}