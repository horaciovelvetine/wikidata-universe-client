import { P5CanvasInstance } from "@p5-wrapper/react";
import { Dimensions } from "./dimensions";

/**
 * 2D Version of the Vertex used in the Background-Sketch to add visual interest to an idle screen.
 * Credit for this sketch goes to @ Sagar Arora
 * https://archive.p5js.org/examples/simulate-particles.html
 */

const MAX_SPEED = 0.7;
const MAX_RADIUS = 10;
const MIN_RADIUS = 2
const CONNECTION_DIST_MAX = 100;

export class Particle {
  p5: P5CanvasInstance;
  xPos: number;
  yPos: number;
  rad: number;
  xSpeed: number;
  ySpeed: number;

  constructor(p5: P5CanvasInstance, dimensions: Dimensions) {
    this.p5 = p5;
    this.xPos = p5.random(0, dimensions.width);
    this.yPos = p5.random(0, dimensions.height);
    this.rad = p5.random(MIN_RADIUS, MAX_RADIUS);
    this.xSpeed = p5.random(-MAX_SPEED, MAX_SPEED)
    this.ySpeed = p5.random(-MAX_SPEED, MAX_SPEED)
  }

  /**
   * @method draw() - draws the particle onto the screen
   */
  draw() {
    this.p5.noStroke();
    this.p5.fill('rgba(173, 181, 189, 0.2)');
    this.p5.circle(this.xPos, this.yPos, this.rad);
  }

  /**
   * @method joinNearby() - connect this particle to any neighbors within the @var CONNECTION_DIST_MAX { 100 units } with a line
   */
  joinNearby(particlesArr: Particle[]) {
    particlesArr.forEach(particle => {
      const distance = this.p5.dist(this.xPos, this.yPos, particle.xPos, particle.yPos)
      if (distance < CONNECTION_DIST_MAX) {
        this.p5.stroke('rgba(16, 84, 136, 0.3)');
        this.p5.line(this.xPos, this.yPos, particle.xPos, particle.yPos);
      }
    })
  }

  /**
   * @method move() - moves this particle in between draw() calls.
   */
  move() {
    if (this.xPos < 0 || this.xPos > this.p5.width) {
      this.xSpeed *= -1;
      this.xPos = this.p5.constrain(this.xPos, 0, this.p5.width);
    }
    if (this.yPos < 0 || this.yPos > this.p5.height) {
      this.ySpeed *= -1;
      this.yPos = this.p5.constrain(this.yPos, 0, this.p5.height);
    }
    this.xPos += this.xSpeed;
    this.yPos += this.ySpeed;
  }
}