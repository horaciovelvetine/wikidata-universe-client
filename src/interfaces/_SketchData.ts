import { Edge, Vertex, Property } from "../p5/models";
import { iEdge, iProperty, iVertex } from ".";

export interface SketchData {
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
  queue: any; // no need to futz here ever on client side
}