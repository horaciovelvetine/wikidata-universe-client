import '../styles/components/P5SketchMain.css';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';
import { ISessionData } from '../interfaces';
import Test from '../../public/session-body-r1-1.json'

interface QuerySketchProps {
  session: ISessionData;
}

export const QuerySketch: React.FC<QuerySketchProps> = ({ session }) => {
  console.log(Test);
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


