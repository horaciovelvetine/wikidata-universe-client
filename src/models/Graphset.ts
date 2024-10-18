import { iEdge } from "./Edge";
import { iPoint3D } from "./Point3D";
import { iProperty } from "./Property";
import { iVertex } from "./Vertex";

export interface iGraphset {
  vertices: iVertex[];
  properties: iProperty[];
  edges: iEdge[];
}

export interface MinMaxSet {
  x: MinMax;
  y: MinMax;
  z: MinMax
}

interface MinMax {
  min: number;
  max: number;
  diff: number;
}

export class Graphset implements iGraphset {
  vertices: iVertex[] = [];
  properties: iProperty[] = [];
  edges: iEdge[] = [];

  calcVertexSetMean(vertices: iVertex[]): iPoint3D {
    let x = 0, y = 0, z = 0;
    vertices.forEach((vertex) => {
      x += vertex.coords.x;
      y += vertex.coords.y;
      z += vertex.coords.z;
    });
    return { x: x / vertices.length, y: y / vertices.length, z: z / vertices.length };
  }

  minMaxValuesInSet(vertices: iVertex[]): MinMaxSet {
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let zMin = Infinity, zMax = -Infinity;
    vertices.forEach((vertex) => {
      if (vertex.coords.x < xMin) xMin = vertex.coords.x;
      if (vertex.coords.x > xMax) xMax = vertex.coords.x;
      if (vertex.coords.y < yMin) yMin = vertex.coords.y;
      if (vertex.coords.y > yMax) yMax = vertex.coords.y;
      if (vertex.coords.z < zMin) zMin = vertex.coords.z;
      if (vertex.coords.z > zMax) zMax = vertex.coords.z;
    });

    const xDiff = xMax - xMin
    const yDiff = yMax - yMin
    const zDiff = zMax - zMin
    return {
      x: { min: xMin, max: xMax, diff: xDiff }, y: { min: yMin, max: yMax, diff: yDiff }, z: { min: zMin, max: zMax, diff: zDiff }
    }
  }
}