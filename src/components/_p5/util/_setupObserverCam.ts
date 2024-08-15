import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { Camera } from "p5"

export function setupObserverCam(cam: Camera, p5: P5CanvasInstance<SketchProps>, obsCam: Camera) {
  obsCam = p5.createCamera();
  obsCam.setPosition(cam.eyeX, cam.eyeY, cam.eyeZ + 50);
  obsCam.lookAt(cam.eyeX, cam.eyeY, cam.eyeZ);
}