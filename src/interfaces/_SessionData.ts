import { iEdge, iVertex } from "../interfaces";

export interface SessionData {
  query: string | undefined;
  vertices: iVertex[];
  edges: iEdge[];
  properties: any;
  queue: any;
}