export interface iPoint3D {
  x: number;
  y: number;
  z: number;
}

export class Point3D implements iPoint3D {
  x: number;
  y: number;
  z: number;

  constructor();
  constructor(point?: iPoint3D);
  constructor(x: number, y: number, z: number);
  constructor(pointOrX?: number | iPoint3D, y?: number, z?: number) {
    if (typeof pointOrX === "number") {
      this.x = pointOrX;
      this.y = y!;
      this.z = z!;
    } else if (pointOrX) {
      this.x = pointOrX.x;
      this.y = pointOrX.y;
      this.z = pointOrX.z;
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }
  }

  string(): string {
    return `[${Math.round(this.x)}, ${Math.round(this.y)}, ${Math.round(this.z)}]`;
  }
}
