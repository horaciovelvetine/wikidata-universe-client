import { Dimensions, iEdge, iVertex } from "../interfaces";

export interface SessionData {
  err: any | null;
  query: string | undefined;
  dimensions: Dimensions | null;
  vertices: iVertex[];
  edges: iEdge[];
  properties: any;
  queue: any;
}