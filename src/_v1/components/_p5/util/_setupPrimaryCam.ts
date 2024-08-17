import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { Camera } from "p5";

export function setupPrimaryCam(cam: Camera, p5: P5CanvasInstance<SketchProps>): Camera {
  cam = p5.createCamera();
  cam.setPosition(0, 0, 100);
  cam.lookAt(0, 0, 0);
  return cam;
}