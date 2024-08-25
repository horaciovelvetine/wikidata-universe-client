import { Vertex } from "../models";

export function vertexInSelectedHistory(selectedHistory: Vertex[], vert: Vertex): boolean {
  for (const vertex of selectedHistory) {
    if (vertex.id == vert.id) {
      return true;
    }
  }
  return false;
}