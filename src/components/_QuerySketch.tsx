import '../styles/components/P5SketchMain.css';
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';
import { ISessionData } from '../interfaces';
import { Camera } from 'p5';
import { Vertex } from './_p5';
import { drawUIConstants, drawUIToggleable } from './_p5/UI';
import { traceRay } from '../functions';
import { setupObserverCam, setupPrimaryCam } from './_p5/util';

interface QuerySketchProps {
  session: ISessionData;
}

let cam: Camera;
let obsCam: Camera

let params = {
  displayAxis: false,
  displayBoundingBox: true,
  useObsCam: false,
  drawObsCamGiz: false,
  drawCamGiz: true,
  drawCamFocalGiz: true,
  drawObsCamFocalGiz: false,
}

export const QuerySketch: React.FC<QuerySketchProps> = ({ session }) => {
  const sketch: Sketch = (p5) => {
    //SETUP
    p5.setup = () => {
      p5.createCanvas(session.dimensions.width, session.dimensions.height, p5.WEBGL);
      setupPrimaryCam(cam, p5);
      setupObserverCam(cam, p5, obsCam);
      p5.setCamera(cam);
    }
    // DRAWING
    p5.draw = () => {
      // UI & Optional UI
      drawUIConstants(p5)
      drawUIToggleable(p5, params, obsCam, cam)
      // Data
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
        if (!params.useObsCam) {
          p5.setCamera(obsCam);
        } else {
          p5.setCamera(cam);
        }
        params.useObsCam = !params.useObsCam
      }
    }

    p5.mouseClicked = () => {
      // DemoTestSessionBody.vertices.forEach(vertData => {
      //   const v = new Vertex(vertData.label, vertData.description, vertData.coords)
      //   const isVertSelection = traceRay(p5, cam, v);
      //   if (isVertSelection) {
      //     console.log(v.label + " clicked.")
      //   } else {
      //     console.log("no target clicked.")
      //   }
      // })
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}