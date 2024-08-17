import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera } from "p5";
import { VERTEX_RADIUS } from "../_Vertex";

export function drawCamPosGiz(p5: P5CanvasInstance, cam: Camera, radius: number = (VERTEX_RADIUS)) {
  p5.push();

  const x = cam.eyeX;
  const y = cam.eyeY;
  const z = cam.eyeZ;

  p5.translate(x, y, z);

  p5.noStroke();
  p5.normalMaterial();
  p5.box(radius);
  p5.translate(0, 0, radius);
  p5.rotateX(p5.HALF_PI);
  p5.translate(0, -1.5 * (radius), 0);
  p5.cone(radius * .4, radius * .8);

  p5.pop();
}