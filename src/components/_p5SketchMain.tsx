import { useState, useEffect } from 'react';
import { calculateDrawingDimensions } from '../functions';
import { useDebounce } from '../hooks';
import { IDimensions } from '../interfaces';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';

export const P5SketchMain: React.FC = () => {
  const [drawingSize, setDrawingSize] = useState<IDimensions>(calculateDrawingDimensions(window));

  const handleResizeDebounces = useDebounce(() => {
    setDrawingSize(calculateDrawingDimensions(window));
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResizeDebounces);

    return () => {
      window.removeEventListener('resize', handleResizeDebounces);
    };
  }, [handleResizeDebounces]);

  const sketch: Sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      console.log('P5SketchMain.tsx: setup() drawingSize:', drawingSize.width, drawingSize.height)
      p5.createCanvas(drawingSize.height, drawingSize.width);
    }
    p5.draw = () => {
      p5.background(1, 1, 14);
      p5.fill(255);
      // p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}


