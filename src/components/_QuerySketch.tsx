import '../styles/components/P5SketchMain.css';
import { ReactP5Wrapper, Sketch } from '@p5-wrapper/react';
import { ISessionData } from '../interfaces';
import { Camera, Font } from 'p5';
import { Vertex } from './_p5';
import { drawUIConstants, drawUIToggleable, drawVertexLabelOnHover } from './_p5/UI';
import { setupPrimaryCam } from './_p5/util';
import { traceRay } from './_p5/func';
import CharisBold from '../assets/font/CharisSIL-Bold.ttf'

//TEST DATA 
import TestData from '../assets/data/session-body-r1-1.json'

interface QuerySketchProps {
  session: ISessionData;
}

let cam: Camera;
let animCam: Camera;
let hoveredVert: Vertex | undefined;
let font: Font;

let params = {
  displayAxis: false,
  displayBoundingBox: true,
}

export const QuerySketch: React.FC<QuerySketchProps> = ({ session }) => {
  const sketch: Sketch = (p5) => {
    p5.preload = () => {
      font = p5.loadFont(CharisBold)
    }
    //SETUP
    p5.setup = () => {

      p5.createCanvas(session.dimensions.width, session.dimensions.height, p5.WEBGL);
      cam = setupPrimaryCam(cam, p5);
      animCam = p5.createCamera();
      p5.setCamera(cam);
    }
    // DRAWING
    p5.draw = () => {
      // UI & Optional UI
      drawUIConstants(p5)
      drawUIToggleable(p5, params)
      drawVertexLabelOnHover(p5, hoveredVert, cam, font);
      // Data
      TestData.vertices?.forEach(v => {
        const vert = new Vertex(v.label, v.description, v.coords);
        vert.draw(p5);
      })
    }
    //HANDLING
    p5.keyPressed = (e: KeyboardEvent) => {
      // print info to console
      if (e.key == "i") {
        console.log(params, p5, cam)
      }

      if (e.key == "a") {
        params.displayAxis = !params.displayAxis
      }

      if (e.key == "b") {
        params.displayBoundingBox = !params.displayBoundingBox
      }
    }

    p5.mouseClicked = () => {
      TestData.vertices?.forEach(vertex => {
        const vert = new Vertex(vertex.label, vertex.description, vertex.coords);
        const isVertexClick = traceRay(p5, cam, vert)

        if (isVertexClick) {
          // focus camera on clicked vert
          animCam.setPosition(cam.eyeX, cam.centerY, cam.eyeZ);
          animCam.lookAt(vert.coordinates.x, vert.coordinates.y, vert.coordinates.z)
          cam.slerp(cam, animCam, 1);
          // pin vert details on screen...
        }
      })
    }

    p5.mouseMoved = () => {
      TestData.vertices?.forEach(vertex => {
        const vert = new Vertex(vertex.label, vertex.description, vertex.coords);
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