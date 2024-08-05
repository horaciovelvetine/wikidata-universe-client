import '../assets/styles/components/P5SketchMain.css';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';
import { IWikidataUniverseSession } from '../interfaces';

interface P5SketchMainProps {
  session: IWikidataUniverseSession;
}

export const P5SketchMain: React.FC<P5SketchMainProps> = ({ session }) => {
  const sketch: Sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      p5.createCanvas(session.dimensions.height, session.dimensions.width);
    }
    p5.draw = () => {
      p5.background(1, 1, 14);
      p5.fill(255);
      // p5.ellipse(p5.mouseX, p5.mouseY, 50, 50);
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}


