import { P5CanvasInstance } from "@p5-wrapper/react";
import { Point3D, iVertex } from "../../interfaces";

export class Vertex implements iVertex {
  id: string;
  label: string;
  description: string;
  coords: Point3D;
  radius: number = 10;
  constructor(vertex: iVertex);
  constructor(vertex: Vertex) {
    this.id = vertex.id;
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
    p5.box(10);
    p5.stroke(0);
    p5.pop();
  }
}