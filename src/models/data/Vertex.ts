import { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";
import { Camera, Font } from "p5";
import { iPoint3D, Point3D } from "./Point3D";
import { Edge, iEdge } from "./Edge";
import { Graphset } from "./Graphset";

export interface iVertex {
  id: string;
  label: string | null;
  description: string | null;
  radius: number;
  coords: iPoint3D;
  sketchCoords: Point3D | null;
  fetched: boolean;
  origin: boolean;
  locked: boolean;
}

export class Vertex implements iVertex {
  id: string;
  label: string | null;
  description: string | null;
  radius: number;
  coords: Point3D;
  sketchCoords: Point3D | null = null; // cx side only 
  fetched: boolean;
  origin: boolean;
  locked: boolean;

  constructor(vertex: iVertex) {
    this.id = vertex.id;
    this.label = vertex.label;
    this.description = vertex.description;
    this.radius = vertex.radius;
    this.coords = vertex.coords;
    this.fetched = vertex.fetched;
    this.origin = vertex.origin;
    this.locked = vertex.locked;
  }

  /**
   * @method coordsStr() - this vertices coords in a simple string representation 
   */
  coordsStr() {
    return `(x: ${Math.round(this.coords.x)}, y: ${Math.round(this.coords.y)}, z: ${Math.round(this.coords.z)})`
  }

  /**
   * @method draw() - draws an in-sketch representation of the Vertex
   */
  draw(p5: P5CanvasInstance, curSelectedVert: Vertex | null) {
    const { x, y, z } = this.sketchCoords ?? this.coords;
    p5.push();
    p5.translate(x, y, z);
    p5.strokeWeight(1.2);
    p5.stroke(1, 1, 14);
    if (curSelectedVert?.id == this.id) {
      p5.fill("rgba(252 , 220 , 18, 0.9)");
    } else {
      p5.fill("rgba(205, 205, 205, 0.8)");
    }
    p5.box(this.radius);
    p5.noStroke();
    p5.pop();
  }

  /**
   * @method drawLabel() - draws a label hovering facing the (in-sketch) up direction towards the camera
   */
  drawLabel(p5: P5CanvasInstance<SketchProps>, cam: Camera, font: Font) {

    if (this.fetched) {
      const { x, y, z } = this.coords;
      const labelStr = `${this.label}`;

      p5.push();
      p5.translate(x, y, z);
      this.applyLabelPositionTransforms(p5, cam);
      this.applyLabelTextSetup(p5, font);
      p5.text(labelStr, 0, 0)
      p5.pop();
    }
  }

  /**
   * @method drawRelatedEdges() - draws any edge which mentions this Vertex (ingoing and outgoing) in the sketch
   */
  drawRelatedEdges(p5: P5CanvasInstance, graph: Graphset) {
    const edgesToDraw = graph.getRelatedEdges(this);
    if (edgesToDraw.length == 0) return;

    edgesToDraw.forEach(edge => {
      const vert2 = this.getAltVertex(graph, edge)!;
      if (vert2.fetched) {
        const isPara = this.parallelEdges(vert2, edge!, edgesToDraw)
        const { x, y, z } = this.coords;
        const { x: x2, y: y2, z: z2 } = vert2.coords;

        p5.push();
        this.setEdgeStrokeColor(p5, edge!, true, (isPara.length > 0));
        p5.line(x, y, z, x2, y2, z2);
        p5.pop();
      }
    });

  }

  /**
   * The English Wikipedia Article for the given Wikidata Vertex (if it exists).
   * @see URL is a guess, Wikidata Entities do not always have article representations.
   */
  url() {
    const wdBaseURL = 'https://www.wikidata.org/wiki/';
    const enWikiBaseURL = 'https://en.wikipedia.org/wiki/';
    if (this.id != null) {
      return /^P/.test(this.id) ?
        wdBaseURL + `Property:${this.id}` : wdBaseURL + this.id;
    };
    return enWikiBaseURL + this.label?.replace(" ", "_")
  }


  /**
   * @return an object containing the rounded { @x , @y , @z } coords 
   */
  xyz() {
    return { x: Math.round(this.coords.x), y: Math.round(this.coords.y), z: Math.round(this.coords.z) }
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

  /**
   * The given Cameras eye positions - this is where it is located in space 
   */
  private eye(cam: Camera) {
    return { ex: cam.eyeX, ey: cam.eyeY, ez: cam.eyeZ }
  }

  /**
   * The given Cameras center positions - this is where it is looking in space
   */
  private focal(cam: Camera) {
    return { fx: cam.centerX, fy: cam.centerY, fz: cam.centerZ }
  }

  /**
   * @return - The @Vertex object on the other end of the given @Edge 
   */
  private getAltVertex(session: Graphset, edge: iEdge): Vertex | null {
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