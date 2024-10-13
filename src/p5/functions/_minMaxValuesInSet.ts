import { iVertex } from "../../interfaces";

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

export function minMaxValuesInSet(vertices: iVertex[]): MinMaxSet {
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
  return { x: { min: xMin, max: xMax, diff: xDiff }, y: { min: yMin, max: yMax, diff: yDiff }, z: { min: zMin, max: zMax, diff: zDiff } };
}