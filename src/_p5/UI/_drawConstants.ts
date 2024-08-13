import { P5CanvasInstance } from "@p5-wrapper/react";

export function drawConstants(p5: P5CanvasInstance) { 
  p5.background(1, 1, 14);
  p5.orbitControl(2, 2, 2);
  p5.lights();
  p5.rectMode(p5.CENTER);
}