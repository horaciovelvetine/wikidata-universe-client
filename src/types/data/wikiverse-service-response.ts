import { Dimensions } from "./dimensions";
import { Edge } from "./edge";
import { LayoutConfig } from "./layout-config";
import { Property } from "./property";
import { Vertex } from "./vertex";

/**
 * The data structure returned by the Wikiverse Service API
 */
export interface WikiverseServiceResponse {
  query: string;
  dimensions: Dimensions;
  vertices: Vertex[];
  edges: Edge[];
  properties: Property[];
  layoutConfig: LayoutConfig;
  err: any;
}
