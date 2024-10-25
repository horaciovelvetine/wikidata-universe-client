import { Dimensions, iEdge, iLayoutConfig, iProperty, iVertex, LayoutConfig } from "../../models";

export interface RequestPayload {
  query: string;
  dimensions: Dimensions;
  vertices: iVertex[];
  edges: iEdge[];
  properties: iProperty[];
  layoutConfig: iLayoutConfig;
}