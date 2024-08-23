import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { iEdge, iVertex, SessionData } from "../../interfaces";
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
    const camX = cam.eyeX;
    const camY = cam.eyeY;
    const camZ = cam.eyeZ;
    const cenX = cam.centerX;
    const cenY = cam.centerY;
    const cenZ = cam.centerZ;

    const labelStr = `${this.label} [x_${(Math.round(x))}, y_${Math.round(y)}, z_${Math.round(z)}]`;

    const pan = p5.atan2(camZ - cenZ, camX - cenX);
    const tilt = p5.atan2(camY - cenY, p5.dist(camX, camZ, cenX, cenZ));

    p5.push();
    p5.translate(x, y, z);

    p5.rotateY(-pan);
    p5.rotateZ(tilt + p5.PI);
    p5.rotateY(-p5.PI / 2);
    p5.rotateZ(p5.PI);

    p5.textSize(8);
    p5.fill('rgb(245, 245, 245)');
    p5.textFont(font);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.translate(0, (this.radius * -1.25), 0); // adjusts for position on 'screen'
    p5.text(labelStr, 0, 0)
    p5.pop();
  }

  drawRelatedEdges(p5: P5CanvasInstance, session: SessionData, isHov: boolean = false) {
    const edgesToDraw = this.getRelatedEdges(session);

    edgesToDraw.forEach(edge => {
      const vert2 = this.getAltVertex(session, edge);
      if (!vert2) return; // no vertex to draw edge to
      p5.push();
      const isPara = this.isParallelEdge(vert2, edge, edgesToDraw)
      this.setEdgeStrokeColor(p5, edge, isHov, isPara);
      const { x, y, z } = this.coords;
      const { x: x2, y: y2, z: z2 } = vert2.coords;
      p5.line(x, y, z, x2, y2, z2);
      p5.pop();
    });
  }

  url() {
    return `https://en.wikipedia.org/wiki/${this.label.replace(" ", "_")}`;
  }

  private getRelatedEdges(session: SessionData) {
    return session.edges.filter(edge => edge.srcId === this.id || edge.tgtId === this.id);
  }

  private getAltVertex(session: SessionData, edge: iEdge) {
    const altId = edge.srcId === this.id ? edge.tgtId : edge.srcId;
    return session.vertices.find(v => v.id === altId);
  }

  private setEdgeStrokeColor(p5: P5CanvasInstance, edge: iEdge, isHov: boolean, isParallel: boolean) {
    const opacity = isHov ? 0.4 : 1;
    const incomingColor = `rgba(100,120,255,${opacity})`;
    const outgoingColor = `rgba(255,80,100,${opacity})`;
    const bothColor = `rgba(135,20,255,${opacity})`;
    if (isParallel) {
      p5.stroke(bothColor);
    } else if (edge.srcId === this.id) {
      p5.stroke(incomingColor);
    } else if (edge.tgtId === this.id) {
      p5.stroke(outgoingColor);
    }
  }

  private isParallelEdge(vert2: iVertex, edge: iEdge, edgesToDraw: iEdge[]) {
    const v2IsTgt = edge.tgtId == vert2.id;
    let occursAsOther;
    if (v2IsTgt) {
      occursAsOther = edgesToDraw.filter(e => e.srcId == vert2.id)
    } else {
      occursAsOther = edgesToDraw.filter(e => e.tgtId == vert2.id);
    }
    return occursAsOther.length != 0;
  }
}