import { Dimensions, Edge, iEdge, iPoint3D, iProperty, iVertex, Vertex, Property } from "..";
import { RequestResponse } from "../../api";

export interface iGraphset {
  vertices: iVertex[];
  properties: iProperty[];
  edges: iEdge[];
  dimensions: Dimensions;
}

export interface MinMaxSet {
  x: MinMax;
  y: MinMax;
  z: MinMax
}

interface MinMax {
  min: number;
  max: number;
  diff: number;
}

export class Graphset implements iGraphset {
  vertices: Vertex[];
  properties: Property[];
  edges: Edge[];
  dimensions: Dimensions;

  constructor(graph: iGraphset) {
    this.vertices = graph.vertices.map(v => { return new Vertex(v) });
    this.edges = graph.edges.map(e => { return new Edge(e) });
    this.properties = graph.properties.map(p => { return new Property(p) });
    this.dimensions = graph.dimensions;
  }

  /**
   * @method calcVertexSetMean() - find the approximate center coords for the Mean of the Graphset's Vertices
   */
  calcVertexSetMean(vertices: iVertex[]): iPoint3D {
    let x = 0, y = 0, z = 0;
    vertices.forEach((vertex) => {
      x += vertex.coords.x;
      y += vertex.coords.y;
      z += vertex.coords.z;
    });
    return { x: x / vertices.length, y: y / vertices.length, z: z / vertices.length };
  }

  /**
   * @method minMaxValuesInSet - provides bounding dimensions used to draw UI around the graphset
   */
  minMaxValuesInSet(vertices: iVertex[]): MinMaxSet {
    let xMin = Infinity, xMax = -Infinity;
    let yMin = Infinity, yMax = -Infinity;
    let zMin = Infinity, zMax = -Infinity;
    vertices.forEach((vertex) => {
      if (vertex.coords.x < xMin) xMin = vertex.coords.x;
      if (vertex.coords.x > xMax) xMax = vertex.coords.x;
      if (vertex.coords.y < yMin) yMin = vertex.coords.y;
      if (vertex.coords.y > yMax) yMax = vertex.coords.y;
      if (vertex.coords.z < zMin) zMin = vertex.coords.z;
      if (vertex.coords.z > zMax) zMax = vertex.coords.z;
    });

    const xDiff = xMax - xMin
    const yDiff = yMax - yMin
    const zDiff = zMax - zMin
    return {
      x: { min: xMin, max: xMax, diff: xDiff }, y: { min: yMin, max: yMax, diff: yDiff }, z: { min: zMin, max: zMax, diff: zDiff }
    }
  }

  /**
   * @method getRelatedEdges() - returns any Edge in the set which references the provided Vertex
   */
  getRelatedEdges(vertex: Vertex): Edge[] {
    return this.edges.filter(edge => {
      if (!edge.srcId || !edge.propertyId || !edge.tgtId) return false; // check edge has needed values
      if (edge.isSource(vertex) || edge.isTarget(vertex) || edge.isLabelMatch(vertex)) {
        const property = this.getProperty(edge.propertyId);
        const source = this.getVertex(edge.srcId);
        const target = this.getVertex(edge.tgtId);
        if (!property || !source || !target) return false; // if can't find source ent, skip!
        return property.fetched && source.fetched && target.fetched; // only return edges where all are fetched
      }
      return false;
    })
  }

  /**
   * @method getOriginVertex() - returns whichever Vertex is marked as.origin true in the current .vertices
   */
  getOriginVertex(): Vertex | null {
    return this.vertices.find(vertex => vertex.origin === true) || null;
  }

  /**
   * @method getProperty() - returns a Property with the provided ID value or null
   */
  getProperty(propertyId: string): Property | null {
    return this.properties.find(property => property.id === propertyId) || null;
  }

  /**
   * @method getVertex() - returns a Vertex with the provided ID value or null
   */
  getVertex(vertexId: string | null): Vertex | null {
    return this.vertices.find(vertex => vertex.id === vertexId) || null;
  }

  /**
   * @method addVertex() - used in the AboutSketch to include new Vertices in the set w/o resetting
   */
  addVertex(aboutVert: iVertex): void {
    this.vertices.push(new Vertex(aboutVert));
  }

  /**
   * @method addEdge() - used in the AboutSketch to include new Edges in the set w/o resetting
   */
  addEdge(aboutEdge: iEdge): void {
    this.edges.push(new Edge(aboutEdge));
  }

  /**
   * @method addProperty() - used in the About Sketch to include new Properties in the set w/o resetting
   */
  addProperty(aboutProp: iProperty): void {
    this.properties.push(new Property(aboutProp));
  }

  /**
   * @method updateVertexPositions() - use the provided RequestResponse and update the vertices with their new positions
   */
  updateVertexPositions(request: RequestResponse): void {
    request.data.vertices.forEach(update => {
      const exisVert = this.getVertex(update.id);
      if (!exisVert) return;

      exisVert.prevCoords = exisVert.coords;
      exisVert.coords = update.coords;
    })
  }
}
