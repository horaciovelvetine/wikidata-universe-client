import { Dimensions, iEdge, iProperty, iVertex } from ".";

export interface RequestPayload {
  query: string;
  dimensions: Dimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
}