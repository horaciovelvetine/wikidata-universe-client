
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { calcSafeDimensions, setupCameraView } from "./functions";
import { SessionData } from "../interfaces";
import { drawSketchConsts } from "./UI";
import { Camera, Font } from "p5";
import { Vertex } from "./models";
import CharisBold from "../assets/font/CharisSIL-Bold.ttf";

interface WikiverseSketchProps {
  session: SessionData;
}

export const WikiverseSketch: React.FC<WikiverseSketchProps> = ({ session }) => {
  let cam: Camera;
  let hoveredVertex: Vertex | undefined;
  let font: Font;

  const WikiverseSketch: Sketch = (p5: P5CanvasInstance) => {
    p5.preload = () => { font = p5.loadFont(CharisBold); };
    p5.setup = () => {
      const { width, height } = calcSafeDimensions();
      p5.createCanvas(width, height, p5.WEBGL);
      p5.textFont(font);
      cam = setupCameraView(p5, cam);
    };

    p5.draw = () => {
      drawSketchConsts(p5);
      session.vertices.forEach((vertex) => {
        new Vertex(vertex).draw(p5);
      });

    };

    p5.mouseClicked = () => { };

    p5.mouseMoved = () => { };

    //* Resize canvas when window is resized (w/ calc'd safe dimensions)
    p5.windowResized = () => {
      const { width, height } = calcSafeDimensions();
      p5.resizeCanvas(width, height);
    };
  };

  return <ReactP5Wrapper sketch={WikiverseSketch} />;
};