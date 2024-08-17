import { iEdge } from "../../interfaces";

export class Edge implements iEdge {
  srcId: string;
  tgtId: string | null;
  propertyId: string;
  label: string | null;
  type: string;
  constructor(edge: iEdge);
  constructor(edge: Edge) {
    this.srcId = edge.srcId;
    this.tgtId = edge.tgtId;
    this.propertyId = edge.propertyId;
    this.label = edge.label;
    this.type = edge.type;
  }
}
