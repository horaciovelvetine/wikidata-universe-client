import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera, Vector } from "p5";
import { Point3D, Point3DImpl } from "../data/point-3d";

export class ManagedCamera {
  private p5: P5CanvasInstance;
  private cam: Camera | null = null;

  private lookAtTgt: Point3D | null = null; // new lookAt target for the Camera
  private curLookAtKeyFrm = 0;
  private lookAtDuration = 200; // in frames

  private positionStart: Point3D | null = null; // where it came from
  private positionTgt: Point3D | null = null; // new position for the Camera to 'get to'
  private curPosKeyFrm = 0;
  private curPosDuration = 160;

  constructor(p5: P5CanvasInstance) {
    this.p5 = p5;
  }

  /**
   * @method setCameraRef() - let the ManagedCamera helper know which camera to use to animate the current sketch
   */
  setCameraRef(camRef: Camera) {
    this.cam = camRef;
  }

  /**
   * Gets the current camera instance.
   * @returns The current camera instance.
   */
  getP5Cam(): Camera | null {
    return this.cam;
  }

  /**
   * @method  advanceAnimations - Advances each of the animations by one frame and guards against a null sketch Camera.
   */
  advanceAnimations(): void {
    if (this.cam === null) return;
    this.advanceLookAt();
    this.advanceCamMove();
  }

  /**
   * @method advanceLookAt() - calculate the shift in what the camera is pointed at needed in order to lookAt a new target smoothly, adjust the camera, then check if the animation is over to reset
   */
  private advanceLookAt(): void {
    if (this.lookAtTgt === null) return;
    const { x, y, z } = this.lookAtChangeVec();
    this.cam!.lookAt(x, y, z);

    if (this.lookAtAnimFinished()) {
      this.lookAtTgt = null;
      this.curLookAtKeyFrm = 0;
      return;
    }
    this.curLookAtKeyFrm += 1;
  }

  /**
   * @method advanceCamMove() - calculate the shift in where the camera is positioned needed in order to move towards a new position smoothly, move the camera, then check if the animation is over to reset
   */
  private advanceCamMove(): void {
    if (!this.positionTgt || !this.positionStart) return;

    // remember original lookAt to correct post cam.move();
    const LAX = this.cam!.centerX;
    const LAY = this.cam!.centerY;
    const LAZ = this.cam!.centerZ;

    const { x, y, z } = this.newPosChangeVec();
    this.cam!.setPosition(x, y, z);

    this.cam!.lookAt(LAX, LAY, LAZ);

    if (this.posAnimFinished()) {
      this.positionTgt = null;
      this.curPosKeyFrm = 0;
      return;
    }
    this.curPosKeyFrm += 1;
  }

  /**
   * @method setLookAtTgt - Sets the target point for the camera to look at.
   */
  setLookAtTgt(point: Point3D): void {
    this.lookAtTgt = point;
    this.curLookAtKeyFrm = 0;
  }

  /**
   * @method setPositionTgt - Sets the new position target point for the camera to ultimately move to
   */
  setPositionTgt(point: Point3D): void {
    if (!this.cam) return;
    const sX = this.cam.eyeX;
    const sY = this.cam.eyeY;
    const sZ = this.cam.eyeZ;
    const curPnt = new Point3DImpl({ x: sX, y: sY, z: sZ });

    //skip if already located here
    if (curPnt.x === point.x && curPnt.y === point.y && curPnt.z === point.z)
      return;

    this.positionStart = curPnt;
    this.positionTgt = point;
    this.curPosKeyFrm = 0;
  }

  /**
   * @method setCamera - Sets the camera instance.
   */
  setCamera(cam: Camera): void {
    this.cam = cam;
  }

  /**
   * @method lookAtAnimFinished() - Check if the current LookAtKeyFrm value is equivalent to the set lookAtDuration maximum
   */
  private lookAtAnimFinished(): boolean {
    return this.curLookAtKeyFrm === this.lookAtDuration;
  }

  /**
   * @method posAnimFinished() - Check if the current curPosKeyFrm value is equivalent to the set curPosDuration maximum
   */
  private posAnimFinished(): boolean {
    return this.curPosKeyFrm === this.curPosDuration;
  }

  /**
   * @method lookAtChangeVec() - Calculates the vector for the camera to look at based on the current keyframe.
   * @returns an interpolated lookAt target value Vector.
   */
  private lookAtChangeVec(): Vector {
    const mult = (this.curLookAtKeyFrm * 1.0001) / this.lookAtDuration; // mult prevents rnd bad calcs for whole ints
    return this.p5.createVector(
      this.p5.lerp(this.cam!.centerX, this.lookAtTgt!.x, mult),
      this.p5.lerp(this.cam!.centerY, this.lookAtTgt!.y, mult),
      this.p5.lerp(this.cam!.centerZ, this.lookAtTgt!.z, mult)
    );
  }

  /**
   * @method newPosChangeVec() - Calculates the vector for the camera to move to based on the current keyframe.
   * @returns an interpolated new position value Vector.
   */
  private newPosChangeVec(): Vector {
    const mult = (this.curPosKeyFrm * 1.0001) / this.curPosDuration;
    return this.p5.createVector(
      this.p5.lerp(this.positionStart!.x, this.positionTgt!.x, mult),
      this.p5.lerp(this.positionStart!.y, this.positionTgt!.y, mult),
      this.p5.lerp(this.positionStart!.z, this.positionTgt!.z, mult)
    );
  }
}
