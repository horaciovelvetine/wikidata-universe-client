import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera } from "p5";

export function drawFocalLineGiz(p5: P5CanvasInstance, cam: Camera) {
  const { eyeX, eyeY, eyeZ } = cam;
  const { centerX, centerY, centerZ } = cam;
  p5.push();
  p5.strokeWeight(0.1)
  p5.stroke(255, 0, 255);
  p5.line(eyeX, eyeY, eyeZ, centerX, centerY, centerZ);
  p5.pop();
}