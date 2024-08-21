import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { iVertex } from "../../interfaces";
import { Camera, Font } from "p5";
import { Point3D } from "./_Point3D";

export class Vertex implements iVertex {
  id: string;
  label: string;
  description: string;
  coords: Point3D;
  radius: number = 30;
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
    p5.box(this.radius);
    p5.stroke(0);
    p5.pop();
  }

  // The way that text & p5.js intertact when using WEBGL leaves a bit to be desired
  // (another) Thank you to @camelCaseSensitive on {github} & @morejpeg on {youtube}
  // Excellent tutorial for this approach ==> (https://www.youtube.com/watch?v=kJMx0F7e9QU)
  // HUD Works around flickering caused by state changes above the p5.js instance
  drawLabel(p5: P5CanvasInstance<SketchProps>, cam: Camera, font: Font) {
    const { x, y, z } = this.coords;

    const labelStr = `${this.label} [X: ${(Math.round(x))}, Y: ${Math.round(y)}, Z: ${Math.round(z)}]`;

    const pan = p5.atan2(cam.eyeZ - cam.centerZ, cam.eyeX - cam.centerX);
    const tilt = p5.atan2(cam.eyeY - cam.centerY, p5.dist(cam.eyeX, cam.eyeZ, cam.centerX, cam.centerZ));

    p5.push();
    p5.translate(x, y, z);

    p5.rotateY(-pan);
    p5.rotateZ(tilt + p5.PI);
    p5.rotateY(-p5.PI / 2);
    p5.rotateZ(p5.PI);

    p5.textSize(8);
    p5.fill('rgba(245, 245, 245, 0.75)');
    p5.textFont(font);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.translate(0, (this.radius * -1.15), 0); // adjusts for position on 'screen'
    p5.text(labelStr, 0, 0)
    p5.pop();
  }

  url() {
    return `https://en.wikipedia.org/wiki/${this.label.replace(" ", "_")}`;
  }
}