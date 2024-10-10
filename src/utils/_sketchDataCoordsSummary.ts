import { SketchData } from "../interfaces";
import { Point3D } from "../p5/models";

interface CoordsSummary {
  id: string,
  x: number,
  y: number,
  z: number
}

export function sketchDataCoordsSummary(data: SketchData): CoordsSummary[] {
  return data.vertices.map(vertex => ({
    id: vertex.id,
    ...vertex.coords
  }));
}