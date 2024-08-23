import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera } from "p5";
import { Point3D } from "./_Point3D";

export class LookAtChange {
  target: Point3D | null;
  currentKeyframe: number = 0;
  duration: number = 120;

  constructor(target: Point3D | null) {
    this.target = target;
  }

  changeVec(p5: P5CanvasInstance, cam: Camera) {
    const mult = this.currentKeyframe * 1.001 / this.duration
    return p5.createVector(
      p5.lerp(cam.centerX, this.target!.x, mult),
      p5.lerp(cam.centerY, this.target!.y, mult),
      p5.lerp(cam.centerZ, this.target!.z, mult),
    )
  }

  advance() {
    if (this.currentKeyframe == this.duration) {
      this.target = null;
      this.currentKeyframe = 0;
      return;
    }
    this.currentKeyframe += 1;
  }

  animInProgress() {
    return this.currentKeyframe <= this.duration;
  }

  hasTarget() {
    return !!this.target;
  }

  setTarget(point: Point3D) {
    this.target = point;
    this.currentKeyframe = 0;
  }

}