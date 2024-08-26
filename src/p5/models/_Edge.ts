import { iEdge, SketchData } from "../../interfaces";
import { Property } from "./_Property";
import { Vertex } from "./_Vertex";

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
    const endPoints = data.vertices.filter(vertexData =>
      (vertexData.id == this.srcId || vertexData.id == this.tgtId)
    )
    if (this.srcId == endPoints[0].id) {
      return { src: new Vertex(endPoints[0]), tgt: new Vertex(endPoints[1]) }
    }
    return { src: new Vertex(endPoints[1]), tgt: new Vertex(endPoints[0]) }
  }

  getPropertyDetails(data: SketchData): Property {
    return data.properties.find(property => this.propertyId == property.id)
  }
}