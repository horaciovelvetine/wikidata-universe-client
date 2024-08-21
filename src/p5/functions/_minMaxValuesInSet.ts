import { iVertex } from "../../interfaces";

export function minMaxValuesInSet(vertices: iVertex[]): { x: { min: number, max: number }, y: { min: number, max: number }, z: { min: number, max: number } } {
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
  return { x: { min: xMin, max: xMax }, y: { min: yMin, max: yMax }, z: { min: zMin, max: zMax } };
}