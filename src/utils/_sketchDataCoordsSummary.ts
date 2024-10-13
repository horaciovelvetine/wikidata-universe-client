import { SketchData } from "../interfaces";

interface CoordsSummary {
  id: string,
  label: string,
  x: number,
  y: number,
  z: number
}

export function sketchDataCoordsSummary(data: SketchData): CoordsSummary[] {
  return data.vertices.map(vertex => ({
    id: vertex.id,
    label: vertex.label,
    ...vertex.coords
  }));
}