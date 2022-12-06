/*
Grain background: by Jason Leung on Unsplash https://unsplash.com/photos/wmyE5IBiOmo
*/

const WINDOW_BUFFER = 64; // extend beyond ends of window
const YSCALE = 0.0009;
const XSCALE = 0.12;
const YSTEP_SIZE = 24; // reduce computation
const ZSTEP_SIZE = 0.004;
const FRAME_RATE = 16;
const BUBBLE_COUNTDOWN = 200;
const MIN_BUBBLE_SIZE = 12;
const MAX_BUBBLE_SIZE = 48;
const MIN_NUM_BUBBLES = 1;
const MAX_NUM_BUBBLES = 3;
const MIN_FADE_RATE = 2;
const MAX_FADE_RATE = 16;
const MIN_DISTANCE_TRAVEL = 32;
const MAX_DISTANCE_TRAVEL = 196;
const MIN_CLICK_CLOUD_RADIUS = 36;
const MAX_CLICK_CLOUD_RADIUS = 124;
const Y_LERP_RATE = 0.008;

let zStep = 0;
let waterLayers = [];
let bubblesOnScreen = [];
let grain;

// todo later
class WaterLayer {
  constructor(color, offset, smoothFactor,colorOffset) {
    this.color = color;
    this.offset = offset;
    this.smoothFactor = smoothFactor;
    this.colorOffset = colorOffset;
    this.currColorOffset = 0;
    this.goingUp = true;
  }
  
  render() {
    fill(this.color);
    noStroke();
    beginShape();
    for (let y = - WINDOW_BUFFER; y < window.innerWidth + WINDOW_BUFFER; y += YSTEP_SIZE) {
      let x = map(noise(y * YSCALE, this.smoothFactor, zStep), 0, 1, 0, height) + this.offset;
      vertex(y, x);
    }
    vertex(width+WINDOW_BUFFER, height+WINDOW_BUFFER);
    vertex(-WINDOW_BUFFER, height+WINDOW_BUFFER);
    endShape(CLOSE);
  }

  changeColor() {
    const r = red(this.color);
    const g = green(this.color);
    const b = blue(this.color);

    if (abs(this.currColorOffset) === this.colorOffset) {
      this.goingUp = !this.goingUp;
    }
    const incr = this.goingUp ?  1 : -1;
      this.color = color(r+incr,g+incr,b+incr);
      this.currColorOffset += incr;
  }
}

class Bubble {
  constructor(x, y) {
     this.x = x;
     this.y = y;
   // generate other bubble properties
     this.targetY = y - round(random(MIN_DISTANCE_TRAVEL, MAX_DISTANCE_TRAVEL));
     this.countdown = BUBBLE_COUNTDOWN;
     this.size = round(random(MIN_BUBBLE_SIZE, MAX_BUBBLE_SIZE));
     this.fadeRate = round(random(MIN_FADE_RATE, MAX_FADE_RATE));
  }  
 
   updateCountdown() {
     this.countdown = max(this.countdown - this.fadeRate, 0);
   }
 
   updateY() {
     this.y = lerp(this.y, this.targetY, Y_LERP_RATE);
   }
 
   render() {
    strokeWeight(1);
    stroke(245,241,231);
    noFill();
    circle(this.x,this.y,this.size);
   }
 }

function preload() {
  grain = loadImage('grain.jpg');
}

function setup() {
  const cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  cnv.style('position', 'fixed');
  frameRate(FRAME_RATE);
  describe('Computer-generated blue ocean waves originating from the bottom of the screen. Clicking on the background generates white bubbles that eventually disappear.');
  generateBack();
  // init waves
  waterLayers.push(new WaterLayer(color(150,188,207), 0, 0.016, 10));
  waterLayers.push(new WaterLayer(color(170,198,227), 80, 0.16, 11));
  waterLayers.push(new WaterLayer(color(177,208,224), 160, 0.4, 12));
  waterLayers.push(new WaterLayer(color(109,130,153), 240, 0.8, 14));
  waterLayers.push(new WaterLayer(color(105,152,171), 360, 0.16,13));
  waterLayers.push(new WaterLayer(color(49,107,131), 400, 0.16, 15));
  waterLayers.push(new WaterLayer(color(64,104,130), 480, 0.4, 16));
  waterLayers.push(new WaterLayer(color(26,55,77), 540, 0.8, 18));
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function touchStarted() {
  addBubbles();
}

function touchMoved() {
  addBubbles();
}

function mouseClicked() {
  addBubbles();
}

function mousePressed() {
  addBubbles();
}

function mouseDragged() {
  addBubbles();
}

function draw() {
  tint(255,255);
  generateBack();
  for (let i = 0; i < waterLayers.length; i++) {
    waterLayers[i].render();
    waterLayers[i].changeColor();
  }
  zStep += ZSTEP_SIZE;
  addGrain();

  // update the bubbles
  for (let i = bubblesOnScreen.length - 1; i >= 0; i--) {
    let curr = bubblesOnScreen[i];
    if (curr.countdown === 0) {
      bubblesOnScreen.splice(i, 1); // remove bubble after it fades
    }
    else {
      curr.updateCountdown();
      curr.updateY();
      curr.render();
    }
  } 
}

function addBubbles() {
  const numBubbles = round(random(MIN_NUM_BUBBLES, MAX_NUM_BUBBLES));
  const radius = round(random(MIN_CLICK_CLOUD_RADIUS, MAX_CLICK_CLOUD_RADIUS));
  for (let i = 0; i < numBubbles; i++) {
    const x = mouseX + (setPositiveNegative() * round(random(0, radius)));
    const y = mouseY + (setPositiveNegative() * round(random(0, radius)));
    const newBubble =  new Bubble(x, y);
    bubblesOnScreen.push(newBubble);
  }
}

function setPositiveNegative() {
  return random(0,1) < 0.5 ? -1 : 1
}

function generateBack() {
  background(24,39,71);
}

function addGrain() {
  tint(255, 10); // change opacity of overlay
  image(grain, 0-WINDOW_BUFFER, 0-WINDOW_BUFFER, width + WINDOW_BUFFER, window.innerHeight + WINDOW_BUFFER);
}