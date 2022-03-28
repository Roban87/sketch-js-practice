const canvasSketch = require('canvas-sketch');

let w = 500;

const settings = {
  dimensions: [ w, w ],
};

let img;
let manager;

const imgCanvas = document.createElement('canvas');
const imgContext = imgCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 1;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  imgCanvas.width = width;
  imgCanvas.height = height;

  return ({ context, width, height }) => {
    imgContext.fillStyle = 'grey';
    imgContext.fillRect(0, 0, width, width);

    imgContext.save();
    imgContext.translate(0, 0);
    imgContext.drawImage(img, 0, 0, width, width);
    imgContext.restore();

    context.drawImage(imgCanvas, 0, 0, width , width);
    
    const data = imgContext.getImageData(0, 0, width, height).data;
    console.log(data);
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = data[cell * i * 4 + 0];
      const g = data[cell * i * 4 + 1];
      const b = data[cell * i * 4 + 2];
      const a = data[cell * i * 4 + 3];

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      context.save();
      context.translate(x, y);

      // for circles
      // context.translate(cell * 0.5, cell * 0.5);

      // sqaures
      context.fillRect(0, 0, cell, cell);

      // circles
      /* context.beginPath();
      context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      context.fill(); */

      context.restore();
    }
  };
};

const loadImage = (url) => {
  return new Promise((resolve, reject) =>{
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.crossOrigin = "Anonymous";
    img.src = url;
  });
};

// const url = `https://picsum.photos/${width}`;
const url = `https://picsum.photos/seed/picsum/${w}/${w}`;

const start = async () => {
  img = await loadImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();
