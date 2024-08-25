import { iEdge } from "./_Edge";
import { Property } from "./_Property";
import { iVertex } from "./_Vertex";

export interface SketchData {
  vertices: iVertex[];
  edges: iEdge[];
  properties: Property[];
  queue: any;
}