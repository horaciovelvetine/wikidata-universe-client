import '../styles/components/P5SketchMain.css';
import { ReactP5Wrapper, P5CanvasInstance, Sketch } from '@p5-wrapper/react';
import { IPoint3D, ISessionData } from '../interfaces';
import DemoTestSessionBody from '../assets/data/session-body-r1-1.json'
import { Camera } from 'p5';

interface QuerySketchProps {
  session: ISessionData;
}

let cxCam: Camera;
let origCam: Camera;

export const QuerySketch: React.FC<QuerySketchProps> = ({ session }) => {
  const sketch: Sketch = (p5: P5CanvasInstance) => {
    p5.setup = () => {
      p5.createCanvas(session.dimensions.width, session.dimensions.height, p5.WEBGL);
      cxCam = p5.createCamera();
      origCam = p5.createCamera();
      p5.setCamera(cxCam)
    }
    p5.draw = () => {
      p5.background(255, 255, 255);
      p5.orbitControl();
      p5.lights();
      // p5.fill(255,255,255,17)
      // p5.box(p5.width, p5.height, p5.width)
      // p5.normalMaterial();
      DemoTestSessionBody.vertices.forEach(v => {
        let tsVert = new Vertex(v.label, v.description, v.coords);
        // p5.translate(tsVert.coordinates.x, tsVert.coordinates.y, tsVert.coordinates.z);
        tsVert.draw(p5);
      })
    }

    p5.mousePressed = (e: MouseEvent) => {
      // add a magnitude mult
      // const x = 100 * (p5.mouseX - p5.width / 2) / (p5.width / 2);
      // const y = 100 * (p5.mouseY - p5.height / 2) / (p5.height / 2);
      // console.log({ pX: p5.mouseX, pY: p5.mouseY, eX: e.clientX, eY: e.clientY, width: p5.width, height: p5.height })
      // console.log({ pXAdjust: x, pYAdjust: y })
      console.log(cxCam);
      // DemoTestSessionBody.vertices.forEach(v => {
      //   if (p5.dist(x, y, v.coords.x, v.coords.y) < 5) {
      //     console.log('Vertex clicked:', v.label);
      //   }
      // })
    }
  }

  return <ReactP5Wrapper sketch={sketch} />
}

class Vertex {
  label: string;
  description: string;
  coordinates: IPoint3D;

  constructor(label: string, description: string, coordinates: IPoint3D) {
    this.label = label;
    this.description = description;
    this.coordinates = coordinates;
  }

  draw(p5: P5CanvasInstance) {
    p5.push();
    p5.translate(this.coordinates.x, this.coordinates.y, this.coordinates.z);
    p5.color(255, 255, 255, 0.0)
    p5.strokeWeight(1.5);
    p5.fill(245, 245, 245, 65)
    p5.box(10)
    p5.pop();
  }
}

class Edge {
  srcId: string;
  tgtId: string;
  label: string;

  constructor(srcId: string, tgtId: string, label: string) {
    this.srcId = srcId;
    this.tgtId = tgtId;
    this.label = label;
  }

  draw(p5: P5CanvasInstance) { }
}


function drawBoundingBox(p5: P5CanvasInstance) {

}