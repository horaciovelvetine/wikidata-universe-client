import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera } from "p5";
import { Point3D } from "../";

export class CameraManager {
  p5: P5CanvasInstance;
  cam: Camera | null;
  target: Point3D | null;
  currentKeyframe: number = 0;
  duration: number = 120;

  constructor(p5: P5CanvasInstance) {
    this.p5 = p5;
    this.target = new Point3D(null); // defaults to (0,0,0) / expected origin
    this.cam = null;
  }

  advance() {
    if (this.cam == null) return;
    const { x, y, z } = this.changeVec();
    this.cam.lookAt(x, y, z);

    if (this.currentKeyframe == this.duration) {
      this.target = null;
      this.currentKeyframe = 0;
      return;
    }
    this.currentKeyframe += 1;
  }

  animInProgress() {
    return this.hasTarget() && this.currentKeyframe <= this.duration;
  }

  setTarget(point: Point3D) {
    this.target = point;
    this.currentKeyframe = 0;
  }

  setCamera(cam: Camera) {
    this.cam = cam;
  }

  private hasTarget() {
    return !!this.target;
  }

  private changeVec() {
    // checks null.cam? above in @advance()
    const mult = this.currentKeyframe * 1.001 / this.duration // mult prevents rnd bad  calcs for whole ints
    return this.p5.createVector(
      this.p5.lerp(this.cam!.centerX, this.target!.x, mult),
      this.p5.lerp(this.cam!.centerY, this.target!.y, mult),
      this.p5.lerp(this.cam!.centerZ, this.target!.z, mult),
    )
  }


}