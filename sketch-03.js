const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);

    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const distance = agent.position.getDistance(other.position);

        if (distance < 200) {
          context.fillStyle = 'white';
          context.strokeStyle = 'white';

          context.lineWidth = math.mapRange(distance, 0, 200, 12, 1);

          context.beginPath();
          context.moveTo(agent.position.x, agent.position.y);
          context.lineTo(other.position.x, other.position.y);
          context.stroke();
        }
      }
    }

    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12);
  }

  bounce(width, height) {
    (this.position.x <= 0 || this.position.x >= width) && (this.velocity.x *= -1);
    (this.position.y <= 0 || this.position.y >= height) && (this.velocity.y *= -1);
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  draw(context) {

    context.save();
    context.translate(this.position.x, this.position.y);

    context.lineWidth = 4;

    context.beginPath();
    // context.fillStyle = 'black';
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();

    context.restore();
  }
}
/* 
const animate = () => {
  console.log('animations runs');
  requestAnimationFrame(animate);
};
animate(); */