import '../styles/components/P5SketchMain.css';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';
import { ISessionData } from '../interfaces';
import DemoTestSessionBody from '../assets/data/session-body-r1-1.json'
import { Camera } from 'p5';
import { Vertex } from '../_p5';
import { drawAxisGiz, drawBoundBoxGiz, drawConstants } from '../_p5/UI';
import { traceRay } from '../functions';

interface QuerySketchProps {
  session: ISessionData;
}

let cam: Camera;
// let obsCam: Camera

let params = {
  displayAxis: true,
  displayBoundingBox: true,
}

export const QuerySketch: React.FC<QuerySketchProps> = ({ session }) => {
  const sketch: Sketch = (p5) => {
    //SETUP
    p5.setup = () => {
      p5.createCanvas(session.dimensions.width, session.dimensions.height, p5.WEBGL);
      cam = p5.createCamera();
      cam.setPosition(0, 0, 100);
      cam.lookAt(0, 0, 0);
    }
    // DRAWING
    p5.draw = () => {
      drawConstants(p5)
      // move near plane closer
      const aspRatio = p5.width / p5.height
      const defFov = (2 * p5.atan(p5.height / 2 / 800));
      p5.perspective(defFov, aspRatio, 1)

      // TOGGLES
      if (params.displayBoundingBox) {
        drawBoundBoxGiz(p5);
      }
      if (params.displayAxis) {
        drawAxisGiz(p5);
      }

      DemoTestSessionBody.vertices.forEach(v => {
        new Vertex(v.label, v.description, v.coords).draw(p5);
      })

    }

    //HANDLING
    p5.keyPressed = (e: KeyboardEvent) => {
      // print info to console
      if (e.key == "i") {
        console.log({ cam })
      }

      if (e.key == "a") {
        params.displayAxis = !params.displayAxis
      }

      if (e.key == "b") {
        params.displayBoundingBox = !params.displayBoundingBox
      }

      if (e.key == "c") {
        console.log('cam switch impl!')
      }
    }

    p5.mouseClicked = () => {
      DemoTestSessionBody.vertices.forEach(vertData => {
        const v = new Vertex(vertData.label, vertData.description, vertData.coords)
        const isVertSelection = traceRay(p5, cam, v);
        if (isVertSelection) {
          console.log(v.label + " clicked.")
        } else {
          console.log("no target clicked.")
        }
      })
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}