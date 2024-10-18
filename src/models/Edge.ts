import { SketchData } from "../interfaces";
import { Vertex } from "./Vertex";

export enum EDGE_DIR { INCOMING, OUTGOING, PARALLEL }

export interface iEdge {
  srcId: string;
  tgtId: string | null;
  propertyId: string;
  label: string | null;
  type: string;
}

export class Edge implements iEdge {
  srcId: string;
  tgtId: string | null;
  propertyId: string;
  label: string | null;
  type: string;
  constructor(edgeData: iEdge) {
    this.srcId = edgeData.srcId;
    this.tgtId = edgeData.tgtId;
    this.propertyId = edgeData.propertyId;
    this.label = edgeData.label;
    this.type = edgeData.type;
  }

  getVertexEndpoints(data: SketchData) {
    // const endPoints = data.vertices.filter(vertexData =>
    //   (vertexData.id == this.srcId || vertexData.id == this.tgtId)
    // )
    // if (this.srcId == endPoints[0].id) {
    //   return { src: new Vertex(endPoints[0]), tgt: new Vertex(endPoints[1]) }
    // }
    // return { src: new Vertex(endPoints[1]), tgt: new Vertex(endPoints[0]) }
  }

  getPropertyDetails(data: SketchData) {
    // const property: iProperty | undefined = data.properties.find(prop => this.propertyId == prop.id);

    // return property ? property : new Property({ id: "def", label: "def", description: "def" })
  }

  getEdgeDirection(currentlySelectedVertex: Vertex) {
    if (currentlySelectedVertex.id == this.srcId) {
      return EDGE_DIR.OUTGOING;
    }
    return EDGE_DIR.INCOMING;
  }
}
