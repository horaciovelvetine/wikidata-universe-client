import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera, Vector } from "p5";
import { Point3D } from "../";

/**
 * Manages the camera in a p5.js environment, allowing for smooth transitions and animations.
 */
export class CameraManager {
  private p5: P5CanvasInstance;
  private cam: Camera | null;
  private target: Point3D | null; // new lookAt target for the Camera
  private currentKeyframe: number = 0;
  private duration: number = 200; // frame animation duration for camera

  constructor(p5: P5CanvasInstance) {
    this.p5 = p5;
    this.target = new Point3D(null); // defaults to (0,0,0) / expected origin
    this.cam = null;
  }

  /**
   * Gets the current camera instance.
   * @returns The current camera instance.
   */
  getP5Cam(): Camera | null {
    return this.cam;
  }

  /**
   * Advances the camera animation by one frame.
   */
  advance(): void {
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

  /**
   * Checks if an animation is in progress.
   * @returns True if an animation is in progress, false otherwise.
   */
  animInProgress(): boolean {
    return this.hasTarget() && this.currentKeyframe <= this.duration;
  }

  /**
   * Sets the target point for the camera to look at.
   * @param point - The target point.
   */
  setTarget(point: Point3D): void {
    this.target = point;
    this.currentKeyframe = 0;
  }

  /**
   * Sets the camera instance.
   * @param cam - The camera instance.
   */
  setCamera(cam: Camera): void {
    this.cam = cam;
  }

  /**
   * Checks if there is a target point set.
   * @returns True if there is a target point, false otherwise.
   */
  private hasTarget(): boolean {
    return !!this.target;
  }

  /**
   * Calculates the vector for the camera to look at based on the current keyframe.
   * @returns The vector for the camera to look at.
   */
  private changeVec(): Vector {
    const mult = this.currentKeyframe * 1.001 / this.duration; // mult prevents rnd bad calcs for whole ints
    return this.p5.createVector(
      this.p5.lerp(this.cam!.centerX, this.target!.x, mult),
      this.p5.lerp(this.cam!.centerY, this.target!.y, mult),
      this.p5.lerp(this.cam!.centerZ, this.target!.z, mult),
    );
  }
}