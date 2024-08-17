import { P5CanvasInstance } from "@p5-wrapper/react";
import { Point3D } from "../../interfaces";

export class Vertex {
  label: string;
  description: string;
  coords: Point3D;
  rad: number = 10; // Default value for radius...
  constructor(vertex: Vertex) {
    this.label = vertex.label;
    this.description = vertex.description;
    this.coords = vertex.coords;
  }

  draw(p5: P5CanvasInstance) {
    p5.push();
    p5.translate(this.coords.x, this.coords.y, this.coords.z);
    p5.strokeWeight(1.2);
    p5.stroke(1, 1, 14);
    p5.fill("rgba(245, 245, 245, 0.85)");
    p5.box(this.rad);
    p5.stroke(0);
    p5.pop();
  }
}