import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { iEdge, iVertex, SketchData } from "../../interfaces";
import { Camera, Font } from "p5";
import { Point3D } from "./_Point3D";
import { Edge } from "./_Edge";

export class Vertex implements iVertex {
  id: string;
  label: string;
  description: string;
  coords: Point3D;
  radius: number = 20;

  constructor(vertex: iVertex);
  constructor(vertex: Vertex) {
    this.id = vertex.id;
    this.label = vertex.label;
    this.description = vertex.description;
    this.coords = vertex.coords;
  }

  draw(p5: P5CanvasInstance, curSelectedVert: Vertex | null) {
    p5.push();
    p5.translate(this.coords.x, this.coords.y, this.coords.z);
    p5.strokeWeight(1.2);
    p5.stroke(1, 1, 14);
    if (curSelectedVert?.id == this.id) {
      p5.fill("rgba(165, 205, 255, 1)");
    } else {
      p5.fill("rgba(205, 205, 205, 0.5)");
    }
    p5.box(this.radius);
    p5.stroke(0);
    p5.pop();
  }

  drawLabel(p5: P5CanvasInstance<SketchProps>, cam: Camera, font: Font) {
    const { x, y, z } = this.coords;
    const labelStr = `${this.label}`;

    p5.push();
    p5.translate(x, y, z);
    this.applyLabelPositionTransforms(p5, cam);
    this.applyLabelTextSetup(p5, font);
    p5.text(labelStr, 0, 0)
    p5.pop();

  }

  drawRelatedEdges(p5: P5CanvasInstance, session: SketchData, isHov: boolean = false) {
    const edgesToDraw = this.getRelatedEdges(session);
    if (!edgesToDraw) return;

    edgesToDraw.forEach(edge => {
      const vert2 = this.getAltVertex(session, edge)!;
      const isPara = this.parallelEdges(vert2, edge!, edgesToDraw)
      const { x, y, z } = this.coords;
      const { x: x2, y: y2, z: z2 } = vert2.coords;

      p5.push();
      this.setEdgeStrokeColor(p5, edge!, isHov, (isPara.length > 0));
      p5.line(x, y, z, x2, y2, z2);
      p5.pop();
    });
  }

  /**
   * The English Wikipedia Article for the given Wikidata Vertex (if it exists).
   * @see URL is a guess, Wikidata Entities do not always have article representations.
   */
  url() {
    return `https://en.wikipedia.org/wiki/${this.label.replace(" ", "_")}`;
  }

  /**
   * @return an object containing the rounded { @x , @y , @z } coords 
   */
  xyz() {
    return { x: Math.round(this.coords.x), y: Math.round(this.coords.y), z: Math.round(this.coords.z) }
  }

  /**
   * Gets a list of edges where this vertex's id is used (as either src || tgt), and excludes any edges which are missing some piece of the data.
   * 
   * @param {SketchData} session - Data structure containing the vertex, and to check against
   * @return {Edge[]} - Returns an array of data complete edges.
   */
  getRelatedEdges(session: SketchData): Edge[] {
    const mentionEdge = session.edges.filter(edge => (this.id == edge.srcId || this.id == edge.tgtId));
    const completeEdges = mentionEdge.filter(edge => this.getAltVertex(session, edge) != undefined);

    return completeEdges.map(edgeData => {
      return new Edge(edgeData)
    })
  }

  /**
 * Determines if there is a parallel edge for a given vertex and edge in a list of edges.
 * A parallel edge exists if there is another edge with the same source and target ids but flipped.
 * 
 * @param {iVertex} vert2 - The vertex to check against.
 * @param {iEdge} edge - The edge to compare.
 * @param {iEdge[]} edgesToDraw - The list of all edges.
 * @return {Edge[]} - Returns an array of paralell edges, if there are any.
 */
  parallelEdges(vert2: iVertex, edge: iEdge, edgesToDraw: iEdge[]): Edge[] {
    const isTarget = edge.tgtId === vert2.id; //determine which is which src||tgt

    const parallelEdges = edgesToDraw.filter(e =>
      isTarget ? e.srcId === vert2.id : e.tgtId === vert2.id
    );

    return parallelEdges.map(edgeDat => { return new Edge(edgeDat) }); //true if found
  }

  /**
   *  
   * The way that text & p5.js intertact when using WEBGL leaves a bit to be desired
   * (another) Thank you to @camelCaseSensitive on {github} & @morejpeg on {youtube}
   * Excellent tutorial for this approach ==> (https://www.youtube.com/watch?v=kJMx0F7e9QU)
   */
  private applyLabelPositionTransforms(p5: P5CanvasInstance<SketchProps>, cam: Camera) {
    const { pan, tilt } = this.calcCamerasAngles(p5, cam);

    p5.rotateY(-pan); //rotate to face camera horizon
    p5.rotateZ(tilt + p5.PI); //rotate to face camera vertical
    p5.rotateY(-p5.PI / 2); // reasons unclear
    p5.rotateZ(p5.PI); // flip around to face (scenes) up
  }
  /**
   * Applies text formatting calls before drawing text to screen.
   */
  private applyLabelTextSetup(p5: P5CanvasInstance<SketchProps>, font: Font) {
    p5.textSize(8);
    p5.fill('rgb(245, 245, 245)');
    p5.textFont(font);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.translate(0, (this.radius * -1.25), 0); // position over vertex
  }

  /**
   * Determine the pan and tilt of the current @Camera in relation to where it is currently focused.
   * @returns - an object containing the pan & tilt {number} values.
   */
  private calcCamerasAngles(p5: P5CanvasInstance<SketchProps>, cam: Camera) {
    const { ex, ey, ez } = { ...this.eye(cam) }
    const { fx, fy, fz } = { ...this.focal(cam) }

    const pan = p5.atan2(ez - fz, ex - fx)
    const tilt = p5.atan2(ey - fy, p5.dist(ex, ez, fx, fz))
    return { pan, tilt }
  }

  private eye(cam: Camera) {
    return { ex: cam.eyeX, ey: cam.eyeY, ez: cam.eyeZ }
  }
  private focal(cam: Camera) {
    return { fx: cam.centerX, fy: cam.centerY, fz: cam.centerZ }
  }

  /**
   * @return - The @Vertex object on the other end of the given @Edge 
   */
  private getAltVertex(session: SketchData, edge: iEdge): Vertex | null {
    const altVertexId = edge.srcId === this.id ? edge.tgtId : edge.srcId;
    const altVertexData = session.vertices.find(v => v.id === altVertexId);

    if (altVertexData) {
      return new Vertex(altVertexData);
    }
    return null;
  }

  /**
   * Applies the color transformation used to draw an Edge based on its direction.
   */
  private setEdgeStrokeColor(p5: P5CanvasInstance, edge: iEdge, isHov: boolean, isParallel: boolean) {
    const opacity = isHov ? 0.4 : 1;
    const incomingColor = `rgba(30,0,255,${opacity})`;
    const outgoingColor = `rgba(255,50,80,${opacity})`;
    const bothColor = `rgba(135,20,255,${opacity})`;

    if (isParallel) {
      p5.stroke(bothColor);
    } else if (edge.srcId === this.id) {
      p5.stroke(outgoingColor);
    } else if (edge.tgtId === this.id) {
      p5.stroke(incomingColor);
    }
  }

}