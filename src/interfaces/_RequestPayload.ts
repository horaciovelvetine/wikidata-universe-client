import { Edge, Vertex, Property } from "../p5/models";
import { Dimensions, iEdge, iProperty, iVertex } from ".";

export interface RequestPayload {
  query: string;
  dimensions: Dimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
  queue: any; // no need to futz here ever on client side
}