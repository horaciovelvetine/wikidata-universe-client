import { multiply, inv } from "mathjs";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { iPoint3D, Point3D } from "..";
import { Camera, Font, Vector } from "p5";

export interface iVertex {
  id: string;
  label: string;
  description: string;
  fetched: boolean;
  origin: boolean;
  locked: boolean;
  radius: number;
  coords: iPoint3D;
}

// Number of frames for any vertex which is currently moving to a new position
const COORD_TRANSITION_DURATION = 65;

export class Vertex implements iVertex {
  id: string;
  label: string;
  description: string;
  fetched: boolean;
  origin: boolean;
  locked: boolean;
  readonly radius: number = 20;
  coords: Point3D;
  prevCoords: Point3D | null = null;
  coordTransitionKeyFrm = 1;


  constructor();
  constructor(id: string, label: string, description: string, fetched: boolean, origin: boolean, locked: boolean, coords: iPoint3D);
  constructor(vertex: iVertex);
  constructor(
    idOrVertex?: string | iVertex,
    label?: string,
    description?: string,
    fetched?: boolean,
    origin?: boolean,
    locked?: boolean,
    coords?: iPoint3D
  ) {
    if (typeof idOrVertex === "string") {
      this.id = idOrVertex;
      this.label = label || "";
      this.description = description || "";
      this.fetched = fetched || false;
      this.origin = origin || false;
      this.locked = locked || false;
      this.coords = new Point3D(coords);
    } else if (typeof idOrVertex === "object") {
      this.id = idOrVertex.id;
      this.label = idOrVertex.label;
      this.description = idOrVertex.description;
      this.fetched = idOrVertex.fetched;
      this.origin = idOrVertex.origin;
      this.locked = idOrVertex.locked;
      this.coords = new Point3D(idOrVertex.coords);

    } else {
      this.id = "";
      this.label = "";
      this.description = "";
      this.fetched = false;
      this.origin = false;
      this.locked = false;
      this.coords = new Point3D();
    }
  }

  mergeResponseData(vert: iVertex) {
    this.label = vert.label;
    this.coords = new Point3D(vert.coords);
    this.description = vert.description
    this.fetched = true;

  }

  /**
   * The English Wikipedia Article for the given Wikidata Vertex (if it exists).
   * @see URL is a guess, Wikidata Entities do not always have article representations.
   */
  url() {
    const wdBaseURL = 'https://www.wikidata.org/wiki/';
    if (this.id != null) {
      return /^P/.test(this.id) ?
        wdBaseURL + `Property:${this.id}` : wdBaseURL + this.id;
    } // falls back to a guess at the default en-wiki url...
    const enWikiBaseURL = 'https://en.wikipedia.org/wiki/';
    return enWikiBaseURL + this.label?.replace(" ", "_")
  }

  /**
   * @method draw() - called on every frame of a Sketch in p5.js to draw the Vertex on screen
   */
  draw(p5: P5CanvasInstance, isSelected: boolean) {
    p5.push();
    if (this.prevCoords) { // vertices is currently in motion to a new position
      const drawCoords = this.calcCoordUpdateVectorPosition(p5);
      p5.translate(drawCoords.x, drawCoords.y, drawCoords.z);
      this.coordTransitionKeyFrm += 1;
      if (this.coordTransitionKeyFrm === COORD_TRANSITION_DURATION) {
        this.coordTransitionKeyFrm = 1;
        this.prevCoords = null;
      }
    } else { // vertex is stationary
      p5.translate(this.coords.x, this.coords.y, this.coords.z)
    }

    p5.strokeWeight(1.2);
    p5.stroke(1, 1, 14);
    if (isSelected) {
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
  drawLabel(p5: P5CanvasInstance, cam: Camera, font: Font) {

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
 * @method calcCoordUpdateVectorPosition() - provide a coordinate position to move the vertex to if it is currently moving positions
 */
  calcCoordUpdateVectorPosition(p5: P5CanvasInstance): Vector {
    const mult = this.coordTransitionKeyFrm * 1.0001 / COORD_TRANSITION_DURATION;
    return p5.createVector(
      p5.lerp(this.prevCoords!.x, this.coords.x, mult),
      p5.lerp(this.prevCoords!.y, this.coords.y, mult),
      p5.lerp(this.prevCoords!.z, this.coords.z, mult),
    )
  }

  /**
 * 
 * @method applyLabelPositionTransforms() - The way that text & p5.js intertact when using WEBGL
 * leaves a bit to be desired. The applied translations face a Vertices label to the camera legibly.
 * Thank you to @camelCaseSensitive on {github} & @morejpeg on {youtube}
 * Excellent tutorial for this approach ==> (https://www.youtube.com/watch?v=kJMx0F7e9QU)
 * 
 * @apiNote - these translations are called deliberately in order, accumulating these in singular calls breaks the positioning.
 */
  private applyLabelPositionTransforms(p5: P5CanvasInstance, cam: Camera) {
    const { pan, tilt } = this.calcCamerasAngles(p5, cam);

    p5.rotateY(-pan); //rotate to face camera horizon
    p5.rotateZ(tilt + p5.PI); //rotate to face camera vertical
    p5.rotateY(-p5.PI / 2); // reasons unclear
    p5.rotateZ(p5.PI); // flip around to face (scenes) up
  }
  /**
   * @method applyLabelTextSetup() - helper applies text formatting calls before drawing text to screen.
   */
  private applyLabelTextSetup(p5: P5CanvasInstance, font: Font) {
    p5.textSize(8);
    p5.fill('rgb(245, 245, 245)');
    p5.textFont(font);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.translate(0, (this.radius * -1.25), 0); // position over vertex
  }

  /**
   * @method calcCamerasAngles() - Determine the pan and tilt of the current @Camera in relation to where it is currently focused.
   * @returns - an object containing the pan & tilt {number} values.
   */
  private calcCamerasAngles(p5: P5CanvasInstance, cam: Camera) {
    const { ex, ey, ez } = { ...{ ex: cam.eyeX, ey: cam.eyeY, ez: cam.eyeZ } }
    const { fx, fy, fz } = { ... { fx: cam.centerX, fy: cam.centerY, fz: cam.centerZ } }

    const pan = p5.atan2(ez - fz, ex - fx)
    const tilt = p5.atan2(ey - fy, p5.dist(ex, ez, fx, fz))
    return { pan, tilt }
  }

  /**
 * Traces a ray from the camera through the mouse position on the canvas and checks if it intersects with a given vertex.
 * 
 * @param p5 - The p5.js canvas instance.
 * @param cam - The camera object from p5.js.
 * @returns An array containing the intersection point [x, y, z] if the ray intersects with the vertex, otherwise false.
 * 
 * @apiNote - This function uses the projection and model-view matrices from the p5.js renderer to transform the mouse 
 * coordinates into world coordinates and then checks if the ray intersects with the given vertex, sometimes the matrices 
 * are empty which throws an error - this is only for a single frame as the Sketch mounts and can be ignored. 
 * 
 * @example
 * ```typescript
 * const intersection = traceRay(p5Instance, camera, vertex);
 * return intersection ? [x, y, z] : false;
 * ```
 * 
 * Credit to @camelCaseSensitive on {github} & @morejpeg on {youtube}
 * For the original code, npm package, and tutorial on so many things p5.js
 * Adapted slightly for React/TS and use outside of a p5.js sketch instance
 * @see {@link https://github.com/camelCaseSensitive/p5-raycast/blob/main/p5-raycast.js} for the original implementation.
 */
  traceRay(p5: P5CanvasInstance, cam: Camera) {
    if (!this.fetched) return false; // dissalow collision for unfetched vertices...

    const ndcX = (p5.mouseX - p5.width / 2) / p5.width * 2;
    const ndcY = (p5.mouseY - p5.height / 2) / p5.height * 2;
    const ndcVect = [ndcX, -ndcY, 1, 1];

    // Dig into the p5.js instance to get the projection matrix && copy it to a new mat4
    // not a value intended to be accessed in/by p5.js API - a needed workaround here. 
    const camRenderer = cam as any;
    const p5ProjMat = camRenderer._renderer.uPMatrix.mat4;

    const projMat = [
      [p5ProjMat[0], p5ProjMat[1], p5ProjMat[2], p5ProjMat[3]],
      [p5ProjMat[4], p5ProjMat[5], p5ProjMat[6], p5ProjMat[7]],
      [p5ProjMat[8], p5ProjMat[9], p5ProjMat[10], p5ProjMat[11]],
      [p5ProjMat[12], p5ProjMat[13], p5ProjMat[14], p5ProjMat[15]]
    ];
    const camVec = multiply(ndcVect, inv(projMat));

    // same workaround as above for access to renderer...
    const p5ModMat = camRenderer._renderer.uMVMatrix.mat4;
    const modMat = [
      [p5ModMat[0], p5ModMat[1], p5ModMat[2], p5ModMat[3]],
      [p5ModMat[4], p5ModMat[5], p5ModMat[6], p5ModMat[7]],
      [p5ModMat[8], p5ModMat[9], p5ModMat[10], p5ModMat[11]],
      [p5ModMat[12], p5ModMat[13], p5ModMat[14], p5ModMat[15]]
    ];

    const worldMat = multiply(camVec, inv(modMat));
    const perspDiv = camVec[3];
    const worldVec = [worldMat[0] / perspDiv, worldMat[1] / perspDiv, worldMat[2] / perspDiv];
    const { x, y, z } = { ...this.coords }
    const rayLength = p5.dist(cam.eyeX, cam.eyeY, cam.eyeZ, x, y, z);
    const phi = p5.atan2(worldVec[1] - cam.eyeY, p5.dist(worldVec[0], worldVec[2], cam.eyeX, cam.eyeZ));
    const theta = -p5.atan2(worldVec[0] - cam.eyeX, worldVec[2] - cam.eyeZ) + p5.PI / 2;
    const xVec = cam.eyeX + rayLength * p5.cos(phi) * p5.cos(theta);
    const yVec = cam.eyeY + rayLength * p5.sin(phi);
    const zVec = cam.eyeZ + rayLength * p5.cos(phi) * p5.sin(theta);
    const distFromVert = p5.dist(x, y, z, xVec, yVec, zVec);
    if (distFromVert < this.radius) {
      return [xVec, yVec, zVec];
    }
    return false;
  }

}