import { Dimensions, iEdge, iLayoutConfig, iProperty, iVertex } from "../../models";

export interface RequestPayload {
  query: string;
  dimensions: Dimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
  layoutConfig: iLayoutConfig;
}