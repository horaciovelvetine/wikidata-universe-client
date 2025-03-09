import { Dimensions } from "./dimensions";
import { Edge } from "./edge";
import { LayoutConfig } from "./layout-config";
import { Property } from "./property";
import { Vertex } from "./vertex";

/**
 * The data structure used to make a request to the Wikiverse Service API
 */
export interface WikiverseServiceRequestPayload {
  query: string;
  dimensions: Dimensions;
  vertices: Vertex[];
  edges: Edge[];
  properties: Property[];
  layoutConfig: LayoutConfig;
}
