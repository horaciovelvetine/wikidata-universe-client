import { useState, useEffect } from 'react';
import { calculateDrawingDimensions } from '../functions';
import { useDebounce } from '../hooks';
import { IDimensions } from '../interfaces';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';




export function P5SketchMain() {
  const [drawingSize, setDrawingSize] = useState<IDimensions>(calculateDrawingDimensions(window));
  
  const sketch: Sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      p5.createCanvas(drawingSize.height, drawingSize.width);
    }

    p5.draw = () => {
      p5.background(0);
      p5.fill(255);
      p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
    }
  }

  const handleResizeDebounces = useDebounce(() => {
    console.log('Window size changed to:', drawingSize.width, drawingSize.height)
    setDrawingSize(calculateDrawingDimensions(window));
  }, 300);

  useEffect(() => {
    window.addEventListener('resize', handleResizeDebounces);

    return () => {
      window.removeEventListener('resize', handleResizeDebounces);
    };
  }, [handleResizeDebounces]);

  return <>
    <ReactP5Wrapper sketch={sketch} />
  </>

}
