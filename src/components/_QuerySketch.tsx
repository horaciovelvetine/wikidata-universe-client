import '../styles/components/P5SketchMain.css';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';
import { IWikidataUniverseSession } from '../interfaces';

interface QuerySketchProps {
  session: IWikidataUniverseSession;
}

export const QuerySketch: React.FC<QuerySketchProps> = ({ session }) => {
  const sketch: Sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      p5.createCanvas(session.dimensions.width, session.dimensions.height);
    }
    p5.draw = () => {
      p5.background(1, 1, 14);
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}


