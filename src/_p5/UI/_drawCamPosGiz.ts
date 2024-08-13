import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera } from "p5";
import { VERTEX_RADIUS } from "../_Vertex";

export function drawCamPosGiz(p5: P5CanvasInstance, cam: Camera, radius: number = (VERTEX_RADIUS / 5)) {
  p5.push();

  const x = cam.eyeX;
  const y = cam.eyeY;
  const z = cam.eyeZ;

  p5.translate(x, y, z);

  p5.noStroke();
  p5.normalMaterial();
  p5.sphere(radius);

  p5.pop();
}