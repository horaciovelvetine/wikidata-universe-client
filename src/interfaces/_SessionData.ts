import { iEdge, iVertex } from "../interfaces";

export interface SessionData {
  err: any | null;
  query: string | undefined;
  vertices: iVertex[];
  edges: iEdge[];
  properties: any;
  queue: any;
}