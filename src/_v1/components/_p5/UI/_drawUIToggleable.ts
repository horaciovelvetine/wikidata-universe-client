import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { drawAxisGiz, drawBoundBoxGiz } from ".";

export function drawUIToggleable(p5: P5CanvasInstance<SketchProps>, params: any) {
  if (params.displayBoundingBox) {
    drawBoundBoxGiz(p5);
  }

  if (params.displayAxis) {
    drawAxisGiz(p5);
  }
}