import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera } from "p5";

export function setupCameraView(p5: P5CanvasInstance, cam: Camera) {
  cam = p5.createCamera();
  cam.setPosition(0, 0, 100);
  cam.lookAt(0, 0, 0);
  return cam;
}