
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { calcSafeDimensions, setupCameraView, traceRay, drawSketchUI } from "./functions";
import { SessionData } from "../interfaces";
import { Camera, Font } from "p5";
import { Vertex, Point3D } from "./models";
import CharisBold from "../assets/font/CharisSIL-Bold.ttf";

interface WikiverseSketchProps {
  session: SessionData;
  setCurSelection: React.Dispatch<React.SetStateAction<Vertex | null>>;
  setCam: React.Dispatch<React.SetStateAction<Camera | undefined>>;
}

export const WikiverseSketch: React.FC<WikiverseSketchProps> = ({ session, setCurSelection, setCam }) => {
  let curHoveredVert: Vertex | null;
  let cam: Camera;
  let curSelectedVert: Vertex | null;
  let font: Font;
  let lookAtTarget: Point3D | null = null;
  let lookAtKeyFrame = 0;
  const animKeyframeDur = 120;

  //?                      ?//
  //? SKETCH SKETCH SKETCH ?//
  //?                      ?//
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
        const vert = new Vertex(vDat);
        vert.draw(p5);

        if (vert.id == curHoveredVert?.id) {
          vert.drawLabel(p5, cam, font);
        }
      });
      // Animate: lookAt() => { onClick() }
      if (lookAtTarget && lookAtKeyFrame < animKeyframeDur) {
        const kFMult = lookAtKeyFrame * 1.00001 / animKeyframeDur
        const lookAtChngVec = p5.createVector(
          p5.lerp(cam.centerX, lookAtTarget.x, kFMult),
          p5.lerp(cam.centerY, lookAtTarget.y, kFMult),
          p5.lerp(cam.centerZ, lookAtTarget.z, kFMult)
        )
        cam.lookAt(lookAtChngVec.x, lookAtChngVec.y, lookAtChngVec.z)
        lookAtKeyFrame += 1;
      } else {
        lookAtTarget = null;
        lookAtKeyFrame = 0;
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
          lookAtTarget = new Point3D(vert.coords.x, vert.coords.y, vert.coords.z)
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