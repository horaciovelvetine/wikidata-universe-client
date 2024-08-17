import { P5CanvasInstance } from "@p5-wrapper/react";

export function drawBoundBoxGiz(p5: P5CanvasInstance) {
  p5.push();
  p5.noFill();
  p5.strokeWeight(0.5);
  p5.stroke(255, 255, 255);
  p5.box(p5.width, p5.height, p5.width);
  p5.pop();
}