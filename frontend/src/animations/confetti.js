let themeColor = [
  '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
  '#FF5722'
];
function random_array_item(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function random_num(min, max) {
  return Math.random() * (max - min) + min;
}
class Particle {
  constructor(parent, context) {
    this.gravity = { x: 0, y: 0 }
    this.parent = parent;
    this.reinit();
    //this.release();
    this.form = Math.round(random_num(0, 1));
    this.step = 0;
    this.prise = 0;
    this.priseFacteur = random_num(-0.02, 0.02);
    this.multFacteur = random_num(0.01, 0.08);
    this.priseAngle = 0;
    this.priseVitesse = 0.05;
    this.context = context;
  }
  reinit() {
    this.position = { ...this.parent.position };
    this.position.y = -20;
    this.position.x = random_num(0, window.innerWidth);
    this.taille = Math.round(random_num(5, 15));
    this.moitie = this.taille / 2;
    this.color = random_array_item(themeColor);

    this.gravity = { x: 0, y: 0.15 }
    this.friction = random_num(0.995, 0.98);
    this.velocity = { x: random_num(-6, 6), y: random_num(-10, 2) };

  }

  draw() {

    this.step = 0.5 + Math.sin(this.velocity.y * 15) * 0.5;

    this.prise = this.priseFacteur + Math.cos(this.priseAngle) * this.multFacteur;
    this.priseAngle += this.priseVitesse;
    this.context.translate(this.position.x, this.position.y);
    this.context.rotate(this.velocity.x * 2);
    this.context.scale(1, this.step);
    this.context.fillStyle = this.color;
    if (this.form === 0) {
      this.context.fillRect(-this.moitie, -this.moitie, this.taille, this.taille);
    } else {
      this.context.beginPath();
      this.context.ellipse(0, 0, this.moitie, this.moitie, 0, 0, 2 * Math.PI);
      this.context.fill();
    }
    this.context.setTransform(1, 0, 0, 1, 0, 0);
  }
  integration() {
    this.velocity.x += this.gravity.x;
    this.velocity.y += this.gravity.y;
    this.velocity.x += this.prise;
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
  render() {
    this.integration();
    this.draw();

  }
}
export class ParticleSystem {
  constructor(density, position, context) {
    this.spawning = false;
    this.position = { ...position };
    this.density = density;
    this.runningcount = density;
    this.context = context;
    this.falling = [];
    this.lastPurge = new Date();
    this.drawTimeout = undefined;
  }

  drawLoop() {
    this.render();
    if (this.spawning || Object.keys(this.falling).length > 0){
      const ths = this;
      setTimeout(() => ths.drawLoop(), 20);
    }
  }

  purge(){
    this.falling.filter(p => p.position.y <= window.innerHeight);
  }
  
  start() {
    this.spawning = true;
    if (this.drawTimeout == undefined) {
      this.drawLoop();
    }
  }
  stop() {
    this.spawning = false;
  }

  render() {
    this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    var i;
    for (i = 1; i < this.runningcount; i++) {
      if (this.spawning == true) {
        const p = new Particle(this, this.context)
        this.falling.push(p);
        p.reinit();
      }
      this.runningcount -= 1;
    }
    this.runningcount += this.density;
    for (const p of this.falling){
      p.render();
    }
    if (new Date() - this.lastPurge > 2000){
      this.purge();
    }
  }
}
