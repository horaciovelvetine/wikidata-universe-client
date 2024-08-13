import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera } from "p5";

export function drawCamPerspLinesGiz(p5: P5CanvasInstance, cam: Camera) {
  // const { width, height } = p5;
  const { eyeX, eyeY, eyeZ } = cam;
  const { centerX, centerY, centerZ } = cam;

  const focalVec = p5.createVector((centerX - eyeX), (centerY - eyeY), (centerZ - eyeZ));
  focalVec.normalize();
  focalVec.mult(800);

  p5.push();
  p5.stroke(255, 0, 255);
  p5.strokeWeight(.1);
  p5.line(eyeX, eyeY, eyeZ, eyeX + focalVec.x, eyeY + focalVec.y, eyeZ + focalVec.z);
  p5.stroke(0);
  p5.pop();
}