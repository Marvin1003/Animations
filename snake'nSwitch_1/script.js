(() => {
  const images = document.getElementsByClassName("image");

  let i = -1;
  let d = 100;
  let pX = 0;
  let pY = 0;
  let zIndex = 0;
  
  window.onmousemove = imageMovement;
  
  const imageData = [
    {
      path: 'images/1.jpg',
      width: 400,
      height: 300
    },
    {
      path: 'images/2.jpg',
      width: 300,
      height: 200
    },
    {
      path: 'images/3.jpg',
      width: 350,
      height: 250
    },
    {
      path: 'images/4.jpg',
      width: 250,
      height: 200
    }
  ];

  const createImage = (path,width,height,x,y) => {
    const img = document.createElement('div');

    img.className = "image";
    img.style.backgroundImage = `url(${path})`;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    img.style.transform = `translate(${x}px, ${y}px)`;

    document.body.appendChild(img);
  }

  function imageMovement( {clientX, clientY} ){

    if(((clientX > (pX + d)) || clientX < (pX - d) || (clientY > (pY + d)) || clientY < (pY - d))) {
      pX = clientX;
      pY = clientY;

      if(images.length != imageData.length) {
        i++;
        createImage(imageData[i].path, imageData[i].width, imageData[i].height, clientX - imageData[i].width / 2, clientY - imageData[i].height / 2);
      }
      else {
        zIndex++;
        i = (i + 1) % images.length;
        let currentIMG = images[i];
        let x = clientX - imageData[i].width / 2;
        let y = clientY - imageData[i].height / 2;
        currentIMG.style.zIndex = zIndex++;
        TweenMax.set(currentIMG, { x, y });
      }
    }
  }
})();
