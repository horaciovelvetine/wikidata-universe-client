import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { calcSafeDimensions } from "./functions";
import { SessionData } from "../interfaces";
import { drawSketchConsts } from "./UI";

interface WikiverseSketchProps {
  session: SessionData;
}

export const WikiverseSketch: React.FC<WikiverseSketchProps> = () => {
  //*
  //* Define the P5 sketch
  //*
  const WikiverseSketch: Sketch = (p5: P5CanvasInstance) => {
    p5.preload = () => { };

    p5.setup = () => {
      const { width, height } = calcSafeDimensions();
      p5.createCanvas(width, height, p5.WEBGL);
    };

    p5.draw = () => {
      drawSketchConsts(p5);
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