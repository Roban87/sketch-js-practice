const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
};

let manager;
let image;

let fontFamily = 'serif';

const imgCanvas = document.createElement('canvas');
const imgContext = imgCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  imgCanvas.width = cols;
  imgCanvas.height = rows;

  return ({ context, width, height }) => {
    imgContext.fillStyle = 'black';
    imgContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 0.8;
    imgContext.save();
    imgContext.translate(0, 0);
    imgContext.drawImage(image, 0, 0);
    imgContext.restore();

    const imgData = imgContext.getImageData(0, 0, cols, rows).data;

    context.drawImage(imgCanvas, 0, 0);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.textBaseline = 'middle';
    context.textAlign = 'center';

     for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = imgData[i * 4 + 0];
      const g = imgData[i * 4 + 1];
      const b = imgData[i * 4 + 2];
      const a = imgData[i * 4 + 3];

      const glyph = getGlyph(g);

      context.font = `${fontSize}px ${fontFamily}`;

      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
      // context.fillStyle = `white`;

      context.save();
      context.translate(x, y);
      // for circles
      // context.translate(cell * 0.5, cell * 0.5);

      // sqaures
      // context.fillRect(0, 0, cell, cell);

      // circles
      /* context.beginPath();
      context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      context.fill(); */

      context.fillText(glyph, 0, 0)

      context.restore();
    } 
  };
};

const getGlyph = (v) => {
  if (v < 50) return ' ';
  if (v < 100) return '-';
  if (v < 150) return '=';
  if (v < 200) return '+';

  const glyphs = '#&@*ß$'.split('');

  return random.pick(glyphs);
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

const url = 'https://picsum.photos/200';

const start = async () => {
  image = await loadImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();