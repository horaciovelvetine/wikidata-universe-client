import { iEdge, iProperty, iVertex } from ".";

export interface SketchData {
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
}