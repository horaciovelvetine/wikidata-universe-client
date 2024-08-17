import { P5CanvasInstance } from "@p5-wrapper/react";

export function drawUIConstants(p5: P5CanvasInstance) {
  p5.background(1, 1, 14);
  p5.orbitControl(2, 2, 2);
  p5.rectMode(p5.CENTER);
  // Moves the near plane closer to the camera, otherwise default values
  const aspRatio = p5.width / p5.height
  const defFov = (2 * p5.atan(p5.height / 2 / 800));
  p5.perspective(defFov, aspRatio, 1)
}