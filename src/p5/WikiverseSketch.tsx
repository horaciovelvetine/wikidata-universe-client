
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { calcSafeDimensions, setupCameraView, traceRay } from "./functions";
import { SessionData } from "../interfaces";
import { drawSketchConsts, drawVertexLabel } from "./UI";
import { Camera, Font } from "p5";
import { Vertex } from "./models";
import CharisBold from "../assets/font/CharisSIL-Bold.ttf";

interface WikiverseSketchProps {
  session: SessionData;
  setCurSelection: React.Dispatch<React.SetStateAction<Vertex | null>>;
  setCam: React.Dispatch<React.SetStateAction<Camera | undefined>>;
}

export const WikiverseSketch: React.FC<WikiverseSketchProps> = ({ session, setCurSelection, setCam }) => {
  let cam: Camera;
  let lastVertex: Vertex | null = null;
  let hoveredVertex: Vertex | null = null;
  let font: Font;

  const WikiverseSketch: Sketch = (p5: P5CanvasInstance) => {
    p5.preload = () => { font = p5.loadFont(CharisBold); };
    p5.setup = () => {
      const { width, height } = calcSafeDimensions();
      p5.createCanvas(width, height, p5.WEBGL);
      p5.textFont(font);
      cam = setupCameraView(p5, cam);
      setCam(cam);
    };

    //* ==> DRAW <== *//

    p5.draw = () => {
      drawSketchConsts(p5);
      session.vertices.forEach((vertex) => {
        new Vertex(vertex).draw(p5);
      });
      // hovered && lastSelectedVertex
      drawVertexLabel(p5, hoveredVertex, cam, font);
      drawVertexLabel(p5, lastVertex, cam, font);
    };

    //* ==> CLICK <== *//

    p5.mouseClicked = () => {
      session.vertices.forEach((vertex) => {
        const vert = new Vertex(vertex);
        const vertexClicked = traceRay(p5, cam, vert);
        if (!vertexClicked) return;

        if (lastVertex == null) {
          lastVertex = vert;
          setCurSelection(vert);
        } else {
          if (lastVertex.id === vert.id) {
            setCurSelection(null);
            lastVertex = null;
          } else {
            lastVertex = vert;
            setCurSelection(vert);
          }
        }

      })
    };

    //* ==> HOVER <== *//

    p5.mouseMoved = () => {
      session.vertices.forEach((vertex) => {
        const vert = new Vertex(vertex);
        if (vert == hoveredVertex) return;

        const vertexHovered = traceRay(p5, cam, vert);
        if (vertexHovered) {
          hoveredVertex = vert;
        } else {
          hoveredVertex = null;
        }
      });
    };

    //* ==> RESIZE <== *//

    p5.windowResized = () => {
      const { width, height } = calcSafeDimensions();
      p5.resizeCanvas(width, height);
    };
  };

  return <ReactP5Wrapper sketch={WikiverseSketch} />;
};