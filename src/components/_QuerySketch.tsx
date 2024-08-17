import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';
import { ISessionData } from '../interfaces';
import { Camera, Font } from 'p5';
import { Vertex } from './_p5';
import { drawUIConstants, drawUIToggleable, drawVertexLabelOnHover } from './_p5/UI';
import { setupPrimaryCam } from './_p5/util';
import { traceRay } from './_p5/func';
import CharisBold from '../assets/font/CharisSIL-Bold.ttf'

interface QuerySketchProps {
  session: ISessionData;
  handleClickedVert: (vert: Vertex) => void;
}

let cam: Camera;
let hoveredVert: Vertex | undefined;
let font: Font;

let params = {
  displayAxis: false,
  displayBoundingBox: false,
}

export const QuerySketch: React.FC<QuerySketchProps> = ({ session, handleClickedVert }) => {
  const sketch: Sketch = (p5) => {
    p5.preload = () => {
      font = p5.loadFont(CharisBold)
    }
    //SETUP
    p5.setup = () => {
      p5.createCanvas(session.dimensions.width, session.dimensions.height, p5.WEBGL);
      cam = setupPrimaryCam(cam, p5);
      p5.setCamera(cam);
    }
    // DRAWING
    p5.draw = () => {
      // UI & Optional UI
      drawUIConstants(p5)
      drawUIToggleable(p5, params)
      drawVertexLabelOnHover(p5, hoveredVert, cam, font);
      // Data
      session.vertices?.forEach(v => {
        new Vertex(v).draw(p5);
      })
    }
    //
    //
    //HANDLING CLICKS
    p5.mouseClicked = () => {
      session.vertices?.forEach(v => {
        const vert = new Vertex(v);
        const isClickedVert = traceRay(p5, cam, vert);
        if (isClickedVert) {
          handleClickedVert(vert);
        }
      })
    }
    //
    //
    //HANDLING HOVER
    p5.mouseMoved = () => {
      session.vertices?.forEach(vertex => {
        const vert = new Vertex(vertex);
        if (vert == hoveredVert) return;

        const isHoveredVertex = traceRay(p5, cam, vert);
        if (isHoveredVertex) {
          hoveredVert = vert
        } else {
          hoveredVert = undefined;
        }
      })
    }
  }
  return <ReactP5Wrapper sketch={sketch} />
}