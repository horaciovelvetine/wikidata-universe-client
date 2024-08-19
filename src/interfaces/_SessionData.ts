import { Dimensions, iEdge, iVertex } from "../interfaces";

export interface SessionData {
  query: string | undefined;
  dimensions: Dimensions | undefined;
  vertices: iVertex[];
  edges: iEdge[];
  properties: any;
  queue: any;
}