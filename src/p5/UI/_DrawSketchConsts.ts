import { P5CanvasInstance } from "@p5-wrapper/react";

export function drawSketchConsts(p5: P5CanvasInstance) {
  p5.background('rgb(1, 1, 14)');
  p5.orbitControl(2, 2, 2);
  p5.rectMode(p5.CENTER);
  // move near plane closer to camer, otherwise default
  const aspectRatio = p5.width / p5.height;
  const defaultFoc = (2 * p5.atan(p5.height / 2 / 800));
  p5.perspective(defaultFoc, aspectRatio, 1, 80000);
}