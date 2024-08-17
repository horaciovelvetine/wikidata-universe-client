import { P5CanvasInstance } from "@p5-wrapper/react";

export function drawAxisGiz(p5: P5CanvasInstance) {
  const { width, height } = p5;
  p5.push();
  p5.noStroke();
  p5.strokeWeight(0.25);
  p5.stroke(255, 0, 0);

  // X
  p5.line(-width, 0, 0, width, 0, 0);
  // Y
  p5.stroke(0, 255, 0);
  p5.line(0, -height, 0, 0, height, 0);
  // Z
  p5.stroke(0, 0, 255);
  p5.line(0, 0, -(p5.max(width, height)), 0, 0, p5.max(width, height));

  // Reset
  p5.stroke(0);
  p5.pop();
}