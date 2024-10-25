import { Vertex } from "../";

export enum EDGE_DIR { INCOMING, OUTGOING, PARALLEL }

export interface iEdge {
  srcId: string;
  tgtId: string | null;
  propertyId: string;
  label: string | null;
}

export class Edge implements iEdge {
  srcId: string;
  tgtId: string | null;
  propertyId: string;
  label: string | null;

  constructor(edgeData: iEdge) {
    this.srcId = edgeData.srcId;
    this.tgtId = edgeData.tgtId;
    this.propertyId = edgeData.propertyId;
    this.label = edgeData.label;
  }

  getEdgeDirection(currentlySelectedVertex: Vertex) {
    if (currentlySelectedVertex.id == this.srcId) {
      return EDGE_DIR.OUTGOING;
    }
    return EDGE_DIR.INCOMING;
  }
}
