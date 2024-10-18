import { iEdge } from "./Edge";
import { iProperty } from "./Property";
import { iVertex } from "./Vertex";

export class Graphset {
  vertices: iVertex[] = [];
  properties: iProperty[] = [];
  edges: iEdge[] = [];
}