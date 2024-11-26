import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';
import { calcSafeSketchWindowSize } from '..';
import { Dimensions } from '../../models';

interface ErrorSketchProps {
  containerDimensions: Dimensions
}

export const BackgroundSketch: React.FC<ErrorSketchProps> = ({ containerDimensions }) => {
  const particles: Particle[] = [];
  const sketch: Sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      p5.createCanvas(containerDimensions.width, containerDimensions.height);
      for (let n = 0; n < containerDimensions.width / 10; n++) {
        const particle = new Particle(containerDimensions, p5);
        particles.push(particle);
      }
    }
    p5.draw = () => {
      p5.background('#01010e');
      for (let i = 0; i < particles.length; i++) {
        particles[i].drawParticle();
        particles[i].move();
        particles[i].joinNearby(particles.slice(i))
      }
    }

    p5.windowResized = () => {
      const { width, height } = calcSafeSketchWindowSize();
      p5.resizeCanvas(width, height)
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}

// Credit for this sketch goes to @ Sagar Arora
// https://archive.p5js.org/examples/simulate-particles.html
class Particle {
  p5: P5CanvasInstance
  dimensions: Dimensions
  x: number;
  y: number;
  r: number;
  xSpeed: number;
  ySpeed: number;

  constructor(dimensions: Dimensions, p5: P5CanvasInstance) {
    this.p5 = p5;
    this.dimensions = dimensions;
    this.x = p5.random(0, dimensions.width);
    this.y = p5.random(0, dimensions.height);
    this.r = p5.random(2, 10);
    this.xSpeed = p5.random(-0.7, 0.7);
    this.ySpeed = p5.random(-0.7, 0.7);
  }

  drawParticle() {
    this.p5.noStroke();
    this.p5.fill('rgba(173, 181, 189, 0.2)');
    this.p5.circle(this.x, this.y, this.r);
  }

  joinNearby(particlesArr: Particle[]) {
    particlesArr.forEach(particle => {
      const distance = this.p5.dist(this.x, this.y, particle.x, particle.y)
      if (distance < 100) {
        this.p5.stroke('rgba(16, 84, 136, 0.3)');
        this.p5.line(this.x, this.y, particle.x, particle.y);
      }
    })
  }

  move() {
    if (this.x < 0 || this.x > this.dimensions.width)
      this.xSpeed *= -1;
    if (this.y < 0 || this.y > this.dimensions.height)
      this.ySpeed *= -1;
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}