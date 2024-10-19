import { Dimensions } from "../../interfaces";
import { iVertex } from "../models/Vertex";
import { iEdge } from "../models/Edge";
import { iProperty } from "../models/Property";

export interface RequestPayload {
  query: string;
  dimensions: Dimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
}