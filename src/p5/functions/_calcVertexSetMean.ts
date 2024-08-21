import { iVertex, iPoint3D } from "../../interfaces";

export function calcVertexSetMean(vertices: iVertex[]): iPoint3D {
  let x = 0, y = 0, z = 0;
  vertices.forEach((vertex) => {
    x += vertex.coords.x;
    y += vertex.coords.y;
    z += vertex.coords.z;
  });
  return { x: x / vertices.length, y: y / vertices.length, z: z / vertices.length };
}