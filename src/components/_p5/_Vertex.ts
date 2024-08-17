import { P5CanvasInstance } from "@p5-wrapper/react";
import { IPoint3D, IVertex } from "../../interfaces";

export const VERTEX_RADIUS = 10;

export class Vertex {
  label: string;
  description: string;
  coords: IPoint3D;
  radius: number = VERTEX_RADIUS;
  constructor(vertex: IVertex);
  constructor(label: string, description: string, coordinates: IPoint3D);

  constructor(vertex: IVertex | string, description?: string, coordinates?: IPoint3D) {
    if (typeof vertex === 'string') {
      this.label = vertex;
      this.description = description!;
      this.coords = coordinates!;
    } else {
      this.label = vertex.label;
      this.description = vertex.description;
      this.coords = vertex.coords;
    }
  }

  draw(p5: P5CanvasInstance) {
    p5.push();
    p5.translate(this.coords.x, this.coords.y, this.coords.z);
    p5.strokeWeight(1.2);
    p5.stroke(1, 1, 14);
    p5.fill("rgba(245, 245, 245, 0.85)");
    p5.box(this.radius);
    p5.stroke(0);
    p5.pop();
  }
}