import { iPoint3D } from "../../interfaces";

export class Point3D implements iPoint3D {
  x: number;
  y: number;
  z: number;
  constructor(initPos: iPoint3D | null) {
    if (initPos == null) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    } else {
      this.x = initPos.x;
      this.y = initPos.y;
      this.z = initPos.z;
    }
  }
}