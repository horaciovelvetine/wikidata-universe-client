
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { calcSafeDimensions, setupCameraView, traceRay, drawSketchUI } from "./functions";
import { SessionData } from "../interfaces";
import { Camera, Font } from "p5";
import { Vertex, Point3D, LookAtChange } from "./models";
import CharisBold from "../assets/font/CharisSIL-Bold.ttf";

interface WikiverseSketchProps {
  session: SessionData;
  setCurSelection: React.Dispatch<React.SetStateAction<Vertex | null>>;
  setCam: React.Dispatch<React.SetStateAction<Camera | undefined>>;
}

export const WikiverseSketch: React.FC<WikiverseSketchProps> = ({ session, setCurSelection, setCam }) => {
  let curHoveredVert: Vertex | null;
  let curSelectedVert: Vertex | null;
  let lookAt: LookAtChange = new LookAtChange(null);
  let cam: Camera;
  let font: Font;

  const WikiverseSketch: Sketch = (p5: P5CanvasInstance) => {

    //* ==>       <== *//
    //* ==> SETUP <== *//
    //* ==>       <== *//
    p5.preload = () => { font = p5.loadFont(CharisBold); };
    p5.setup = () => {
      const { width, height } = calcSafeDimensions();
      p5.createCanvas(width, height, p5.WEBGL);
      p5.textFont(font);
      cam = setupCameraView(p5, cam);
      setCam(cam);
    };

    //* ==>      <== *//
    //* ==> DRAW <== *//
    //* ==>      <== *//
    p5.draw = () => {
      drawSketchUI(p5, session);

      if (!!curSelectedVert) {
        curSelectedVert.drawLabel(p5, cam, font);
        curSelectedVert.drawRelatedEdges(p5, session);
      }

      if (!!curHoveredVert) {
        curHoveredVert.drawLabel(p5, cam, font);
        curHoveredVert.drawRelatedEdges(p5, session, true);
      }

      session.vertices.forEach((vDat) => {
        new Vertex(vDat).draw(p5);
      });

      if (lookAt.hasTarget() && lookAt.animInProgress()) {
        const vec = lookAt.changeVec(p5, cam);
        cam.lookAt(vec.x, vec.y, vec.z)
        lookAt.advance();
      }
    };

    //* ==>       <== *//
    //* ==> CLICK <== *//
    //* ==>       <== *//
    p5.mouseClicked = () => {
      session.vertices.forEach((vertex) => {
        const vert = new Vertex(vertex);

        const vertexClicked = traceRay(p5, cam, vert);
        if (!vertexClicked) return;

        if (curSelectedVert != null && curSelectedVert.id == vert.id) {
          curSelectedVert = null
          setCurSelection(null);
        } else {
          lookAt.setTarget(vert.coords);
          curSelectedVert = vert;
          setCurSelection(vert);
        }
      })
    };

    //* ==>       <== *//
    //* ==> HOVER <== *//
    //* ==>       <== *//
    p5.mouseMoved = () => {
      if (curHoveredVert != null) {
        const isStillHoveredVert = traceRay(p5, cam, curHoveredVert)
        if (isStillHoveredVert) return;
      }

      let foundHoveredVert = false;
      session.vertices.forEach(vert => {
        const checkVert = new Vertex(vert);
        if (curSelectedVert?.id == checkVert.id) return;
        const newVertIsHovered = traceRay(p5, cam, checkVert);

        if (newVertIsHovered) {
          curHoveredVert = checkVert;
          foundHoveredVert = true;
        }
      });
      if (!foundHoveredVert) {
        curHoveredVert = null;
      }
    };

    //* ==>      <== *//
    //* ==> KEYS <== *//
    //* ==>      <== *//
    p5.keyReleased = () => {
      if (p5.key === 'i') {
        console.log(session);
        console.log(cam)
      }
    };

    //* ==>        <== *//
    //* ==> RESIZE <== *//
    //* ==>        <== *//
    p5.windowResized = () => {
      const { width, height } = calcSafeDimensions();
      p5.resizeCanvas(width, height);
    };
  };

  return <ReactP5Wrapper sketch={WikiverseSketch} />;
};