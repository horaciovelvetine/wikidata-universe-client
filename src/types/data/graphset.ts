import { defaultDimensions, Dimensions } from "./dimensions";
import { Edge, EdgeImpl } from "./edge";
import { MinMaxSet } from "./min-max-set";
import { Point3D, Point3DImpl } from "./point-3d";
import { Property, PropertyImpl } from "./property";
import { Vertex, VertexImpl } from "./vertex";
import { WikiverseServiceResponse } from "./wikiverse-service-response";

export class Graphset {
  vertices: VertexImpl[] = [];
  properties: PropertyImpl[] = [];
  edges: EdgeImpl[] = [];
  dimensions: Dimensions = defaultDimensions();

  constructor(initSketchData: WikiverseServiceResponse | null) {
    if (initSketchData) {
      this.vertices = initSketchData.vertices.map(v => new VertexImpl(v));
      this.edges = initSketchData.edges.map(e => new EdgeImpl(e));
      this.properties = initSketchData.properties.map(p => new PropertyImpl(p));
      this.dimensions = initSketchData.dimensions;
    }
  }

  /**
   * @method calcVertexSetMean() - find the approximate center coords for the Mean of the Graphset's Vertices
   */
  calcVertexSetMean(): Point3D {
    let x = 0,
      y = 0,
      z = 0;
    const totalVerts = this.vertices.length || 1;
    this.vertices.forEach(vertex => {
      x += vertex.coords.x;
      y += vertex.coords.y;
      z += vertex.coords.z;
    });
    return { x: x / totalVerts, y: y / totalVerts, z: z / totalVerts };
  }

  /**
   * @method minMaxValuesInSet - provides bounding dimensions used to draw UI around the graphset
   */
  minMaxValuesInSet(): MinMaxSet {
    let xMin = Infinity,
      xMax = -Infinity;
    let yMin = Infinity,
      yMax = -Infinity;
    let zMin = Infinity,
      zMax = -Infinity;
    this.vertices.forEach(vertex => {
      if (vertex.coords.x < xMin) xMin = vertex.coords.x;
      if (vertex.coords.x > xMax) xMax = vertex.coords.x;
      if (vertex.coords.y < yMin) yMin = vertex.coords.y;
      if (vertex.coords.y > yMax) yMax = vertex.coords.y;
      if (vertex.coords.z < zMin) zMin = vertex.coords.z;
      if (vertex.coords.z > zMax) zMax = vertex.coords.z;
    });

    const xDiff = xMax - xMin;
    const yDiff = yMax - yMin;
    const zDiff = zMax - zMin;
    return {
      x: { min: xMin, max: xMax, diff: xDiff },
      y: { min: yMin, max: yMax, diff: yDiff },
      z: { min: zMin, max: zMax, diff: zDiff },
    };
  }

  /**
   * @method getRelatedEdges() - returns any Edge in the set which references the provided Vertex
   */
  getRelatedEdges(vertex: Vertex | null): EdgeImpl[] {
    if (!vertex) return [];
    return this.edges.filter(edge => {
      if (!edge.srcId || !edge.propertyId || !edge.tgtId) return false; // check edge has needed values
      if (
        edge.isSource(vertex) ||
        edge.isTarget(vertex) ||
        edge.isLabelMatch(vertex)
      ) {
        const property = this.getProperty(edge.propertyId);
        const source = this.getVertex(edge.srcId);
        const target = this.getVertex(edge.tgtId);
        if (!property || !source || !target) return false; // if can't find source ent, skip!
        return property.fetched && source.fetched && target.fetched; // only return edges where all are fetched
      }
      return false;
    });
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
  getProperty(propertyId: string) {
    return this.properties.find(property => property.id === propertyId) || null;
  }

  /**
   * @method addProperty() - used in the About Sketch to include new Properties in the set w/o resetting
   */
  addProperty(newProp: Property): void {
    this.properties.push(new PropertyImpl(newProp));
  }

  /**
   * @method getVertex() - returns a Vertex with the provided ID value or null
   */
  getVertex(vertexId: string | null) {
    return this.vertices.find(vertex => vertex.id === vertexId) || null;
  }

  /**
   * @method addVertex() - used in the AboutSketch to include new Vertices in the set w/o resetting
   */
  addVertex(newVert: Vertex): void {
    this.vertices.push(new VertexImpl(newVert));
  }

  /**
   * @method getEdge() - returns an Edge with the provided srcID & tgtId
   */
  getEdge(edge: Edge) {
    return (
      this.edges.find(e => e.srcId === edge.srcId && e.tgtId === edge.tgtId) ||
      null
    );
  }

  /**
   * @method addEdge() - used in the AboutSketch to include new Edges in the set w/o resetting
   */
  addEdge(newEdge: Edge): void {
    this.edges.push(new EdgeImpl(newEdge));
  }

  /**
   * @method updateVertexPositions() - use the provided RequestResponse and update the vertices with their new positions
   */
  updateVertexPositions(response: WikiverseServiceResponse): void {
    response.vertices.forEach(update => {
      const exisVert = this.getVertex(update.id);
      if (!exisVert) return;

      exisVert.prevCoords = exisVert.coords;
      exisVert.coords = new Point3DImpl(update.coords);
    });
  }

  /**
   * @method mergeResponseData() - use the Provided WikiverseServiceResponse data and merge it with existing data by individually calling each data model's underlying merge()
   */
  mergeResponseData(response: WikiverseServiceResponse): void {
    this.mergeResponseVertices(response);
    this.mergeResponseEdges(response);
    this.mergeResponseProperties(response);
    this.dimensions = response.dimensions; //provides the scaled size behind the scenes for calculated changes in DataDensity...
  }

  /**
   * @method mergeResponseVertices() - non-desctructively merge response Vertices with existing Vertex data, skips existing fetched vertices, then checks if that Vertex QID is already present and updates or creates and adds a new Vertex.
   */
  private mergeResponseVertices(response: WikiverseServiceResponse): void {
    const skipIds = this.vertices
      .filter(vertex => vertex.fetched)
      .map(vertex => vertex.id);
    response.vertices.forEach(vert => {
      if (skipIds.includes(vert.id)) return;
      const existing = this.getVertex(vert.id);
      if (existing) {
        existing.mergeResponseData(vert);
      } else {
        this.addVertex(new VertexImpl(vert));
      }
    });
  }

  /**
   * @method mergeResponseProperties() - non-desctructively merge response Properties with the existing Properties. Skips existing fetched Properties then checks if that Property PID is already present and updates or creates a new Property.
   */
  private mergeResponseProperties(response: WikiverseServiceResponse): void {
    const skipIds = this.properties
      .filter(prop => prop.fetched)
      .map(prop => prop.id);
    response.properties.forEach(prop => {
      if (skipIds.includes(prop.id)) return;
      const existing = this.getProperty(prop.id);
      if (existing) {
        existing.mergeResponseData(prop);
      } else {
        this.addProperty(new PropertyImpl(prop));
      }
    });
  }

  /**
   * @method mergeResponseEdges() - non-desctructively merge response Edges with the existing Edges. Skips existing fetched Edges then checks if that Edge QID pair is already present and updates or creates a new Property.
   */
  private mergeResponseEdges(response: WikiverseServiceResponse): void {
    const skipIdPairs = this.edges
      .filter(edge => edge.fetched)
      .map(edge => [edge.srcId, edge.tgtId]);
    response.edges.forEach(edge => {
      if (
        skipIdPairs.some(
          ([srcId, tgtId]) => srcId === edge.srcId && tgtId === edge.tgtId
        )
      )
        return;
      const existing = this.getEdge(edge);
      if (existing) {
        existing.mergeResponseData(edge);
      } else {
        this.addEdge(new EdgeImpl(edge));
      }
    });
  }

  /**
   * @method getAltVertex() - using the provided edge, finds the Vertex which was not provided from the data
   */
  getAltVertex(edge: Edge, vert1: Vertex) {
    const altID = edge.srcId === vert1.id ? edge.tgtId : edge.srcId;
    return this.vertices.find(v => v.id === altID) || null;
  }
}
