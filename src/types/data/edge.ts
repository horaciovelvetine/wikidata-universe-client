import { Vertex } from "..";

export interface iEdge {
  srcId: string;
  tgtId: string;
  propertyId: string;
  label: string;
  fetched: boolean;
}

export enum DIRECTION { INCOMING = 'incoming', OUTGOING = 'outgoing', PARALLEL = 'parallel' }

export class Edge implements iEdge {
  srcId: string;
  tgtId: string;
  propertyId: string;
  label: string;
  fetched: boolean;


  constructor();
  constructor(edge: iEdge);
  constructor(edge?: iEdge) {
    this.srcId = edge?.srcId || '';
    this.tgtId = edge?.tgtId || '';
    this.propertyId = edge?.propertyId || '';
    this.label = edge?.label || '';
    this.fetched = edge?.fetched || false;
  }

  /**
   * @method getEdgeDirection() - checks the provided Vertex to check which direction an Edge is in relatetion to that Vertex and return the appropriate @enum @DIRECTION
   */
  getEdgeDirection(vert: Vertex) {
    if (vert.id === this.srcId) {
      return DIRECTION.OUTGOING;
    }
    return DIRECTION.INCOMING;
  }

  isSource(vert: Vertex) {
    return this.srcId === vert.id;
  }

  isTarget(vert: Vertex) {
    return this.tgtId === vert.id;
  }

  isLabelMatch(vert: Vertex) {
    return this.label === vert.label;
  }

  /**
 * @method hasExistingParallelEdgeInRelated() - checks the provided list of Edges (which is based either on the currently hovered or selected Vertex) for existing parallel Edges. An Edge is Parallel if two Edges contain matching sources, targets, and (a singular) propertyID.
 */
  hasExistingParallelEdgeInRelated(relatedEdges: Edge[]) {
    const matchinPropEdges = relatedEdges.filter(edge => edge.propertyId === this.propertyId);

    for (const edge of matchinPropEdges) {
      if (edge.srcId === this.tgtId && edge.tgtId === this.srcId) return true;
    }
    return false;
  }

  /**
   * @method mergeResponseData() - update the current edge with data from the WikiverseServiceResponse
   */
  mergeResponseData(edgeData: iEdge) {
    this.propertyId = edgeData.propertyId;
    this.label = edgeData.label;
    this.fetched = true;
  }
}