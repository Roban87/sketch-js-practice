const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
// const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
};

/* const params = {
  text: 'G',
  fontSize: 1000,
  fontFamily: 'serif',
  fontStyle: 'italic',
  fontWeight: 600,
  glyphs: '_= /!%$#',
} */

let manager;
let text = 'G';
let fontFamily = 'serif';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

    typeContext.fillStyle = 'white';
    typeContext.font = `${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = 'top';

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5  - my;

    typeContext.save();
    typeContext.translate(tx, ty);

    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data ;

    context.drawImage(typeCanvas, 0, 0);

    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.textBaseline = 'middle';
    context.textAlign = 'center';

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.1) {
        context.font = `${cell * 4}px ${fontFamily}`
      }

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
  if (v < 50) return '.';
  if (v < 100) return '-';
  if (v < 150) return '=';
  if (v < 200) return '+';

  const glyphs = ' @!%$#'.split('');

  return random.pick(glyphs);
};

/* const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({  title: 'Text'});
  folder.addInput(params, 'text');
  folder.addInput(params, 'glyphs');

}; */

const onKeyUp = async (e) => {
  console.log(e);
  text = e.key;
  manager.render();
};

document.addEventListener('keyup', onKeyUp);

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

// createPane();
start();