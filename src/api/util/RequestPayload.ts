import { Dimensions, iEdge, iFR3DConfig, iProperty, iVertex } from "../../models";

export interface RequestPayload {
  query: string;
  dimensions: Dimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
  layoutConfig: iFR3DConfig;
}