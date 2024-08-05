import '../assets/styles/components/P5SketchMain.css';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';
import { calculateDrawingDimensions } from '../functions';
import { useState } from 'react';

export const ErrorSketch: React.FC = () => {
  const sketch: Sketch = (p5: P5CanvasInstance) => {
    const dim = calculateDrawingDimensions(window);
    p5.setup = () => {
      p5.createCanvas(dim.height, dim.width);
    }
    p5.draw = () => {
      p5.background(1, 1, 14);
      p5.fill(255);
      p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}

