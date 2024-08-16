import { P5CanvasInstance } from "@p5-wrapper/react";
import { IPoint3D } from "../../interfaces";

export const VERTEX_RADIUS = 10;

export class Vertex {
  label: string;
  description: string;
  coordinates: IPoint3D;
  radius: number = VERTEX_RADIUS;

  constructor(label: string, description: string, coordinates: IPoint3D) {
    this.label = label;
    this.description = description;
    this.coordinates = coordinates;
  }

  draw(p5: P5CanvasInstance) {
    p5.push();
    p5.translate(this.coordinates.x, this.coordinates.y, this.coordinates.z);
    p5.strokeWeight(1.2);
    p5.stroke(1, 1, 14);
    p5.fill("rgba(245, 245, 245, 0.85)");
    p5.box(this.radius);
    p5.stroke(0);
    p5.pop();
  }
}