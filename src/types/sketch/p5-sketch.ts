import CharisTTF from "../../assets/fonts/CharisSIL-Regular.ttf";
import { P5CanvasInstance } from "@p5-wrapper/react";
import { Camera, Font } from "p5";
import { Dispatch, SetStateAction } from "react";

import { getMainDispDimensions } from "../../utils/get-main-disp-dimensions";

import { ManagedCamera } from "./managed-camera";
import { ManagedState } from "./managed-state";
import { Graphset } from "../data/graphset";
import { Point3DImpl } from "../data/point-3d";
import { Vertex, VertexImpl } from "../data/vertex";
import { MinMaxSet } from "../data/min-max-set";
import { Edge } from "../data/edge";
import { WikiverseServiceResponse } from "../data/wikiverse-service-response";
import { WikiverseServiceRequestPayload } from "../data/wikiverse-service-request-payload";
import { WikiverseService } from "../data/wikiverse-service";

export interface SketchProps {
  p5: P5CanvasInstance;
  sketchData: WikiverseServiceResponse | null;
  setSketchRef: Dispatch<SetStateAction<P5Sketch | null>>;
}

export class P5Sketch {
  private p5: P5CanvasInstance;
  private font: Font | undefined;
  private p5cam: Camera | undefined;
  private cam: ManagedCamera;

  graphset: Graphset;
  state: ManagedState;

  constructor({ p5, sketchData, setSketchRef }: SketchProps) {
    this.p5 = p5;
    this.cam = new ManagedCamera(p5);
    this.state = new ManagedState(sketchData);
    this.graphset = new Graphset(sketchData);
    // tell react about the sketch...
    setSketchRef(this);
  }

  /**
   * @method P5CAM()
   * @returns - returns the underlying p5 sketches camera
   */
  P5CAM() {
    return this.p5cam;
  }

  /**
   * @method CAM()
   * @returns - the managed camera instance created for animating the camera gracefully
   */
  CAM() {
    return this.cam;
  }

  /**
   * @method preloadFont() - required p5 call to load a Font resource for use in the sketch
   */
  preloadFont() {
    this.font = this.p5.loadFont(CharisTTF);
  }

  /**
   * @method setTextFont() - called after @method preloadFont() in the subsequent .setup() phase of the p5.js sketch init process
   */
  setTextFont() {
    this.p5.textFont(this.font!);
  }

  /**
   * @method createCanvas() - creates the p5 canvas from the computed size of it's container (element) by getting it directly from the DOM using the helper @method getMainDispDimensions().
   */
  createCanvas() {
    const { width, height } = getMainDispDimensions();
    this.p5.createCanvas(width, height, this.p5.WEBGL);
  }

  /**
   * @method handleWindowResize() - modify the width and heigh of the current sketch to match the changes fired by the browser
   */
  handleWindowResize() {
    const { width, height } = getMainDispDimensions();
    this.p5.resizeCanvas(width, height);
  }

  /**
   * @method initManagedCamera() - Initializes the Camera for the sketch itself (with a slightly modified FOV), and provide the actual p5.js Camera instance to the ManagedCamera class for ref.
   */
  initManagedCamera() {
    this.p5cam = this.p5.createCamera();
    const aspectRatio = this.p5.width / this.p5.height;
    const fovRad = 2 * this.p5.atan(this.p5.height / 2 / 800);
    this.p5.perspective(fovRad, aspectRatio, 1, 12000);
    this.cam.setCameraRef(this.p5cam);
  }

  /**
   * @method initCameraPositionAtOriginVertex() - Positions the managed camera based on the position of the Vertex marked as the origin, or (0,0,0) if that Vertex could not be found
   */
  initCameraPositionAtOriginVertex() {
    if (!this.p5cam || !this.graphset) return;

    const origin = this.graphset.getOriginVertex();
    const { x, y, z } = origin ? origin.coords : { x: 0, y: 0, z: 0 };

    this.p5cam.setPosition(x, y, z + 200);
    this.p5cam.lookAt(x, y + 300, z); // look below vertex for init 'pan-up' effect
    this.cam.setLookAtTgt(new Point3DImpl({ x, y, z }));
  }

  /**
   * Checks which parts of the sketch UI the client currently wants on screen, and calls those draw functions
   */
  drawUI() {
    this.p5.background(this.UI_BG());
    this.p5.orbitControl(
      this.state.xMouseSens(),
      this.state.yMouseSens(),
      this.state.zMouseSens()
    );

    const mp = this.graphset.calcVertexSetMean();
    const minMax = this.graphset.minMaxValuesInSet();

    this.p5.push();
    this.p5.translate(mp.x, mp.y, mp.z);
    this.drawBoundingBox(minMax);
    this.drawAxisOrientation(minMax);
    this.p5.pop();
  }

  /**
   * @method drawVertices() - Iterate all Vertices in the Graphset & draw them to the screen
   */
  drawVertices() {
    this.graphset.vertices.forEach(vert => {
      if (vert.fetched) {
        const isCurSelection = vert.id === this.state.curSelected()?.id;
        vert.draw(this.p5, isCurSelection);
      }
    });
  }

  /**
   * @method drawSelectedDetails() - Checks if the curSelected Vertex is not null and if not draws a label with that Vertices title to screen, and all the Edges which mention the curSelected Vertex from that Vertices perspective (directionally)
   */
  drawSelectedDetails() {
    const selected = this.state.curSelected();
    if (!selected) return;

    selected.drawLabel(this.p5, this.p5cam!, this.font!);
    this.drawRelatedEdges(selected);
  }

  /**
   * @method drawHoveredDetails() - Checks if the curHovered Vertex is not null and if not draws a label with that Vertices title to screen, and all the Edges which mention the curHovered Vertex from that Vertices perspective (directionally)
   */
  drawHoveredDetails() {
    const hovered = this.state.curHovered();
    if (!hovered) return;

    hovered.drawLabel(this.p5, this.p5cam!, this.font!);
    this.drawRelatedEdges(hovered);
  }

  /**
   * @method advanceCanimations() - tick the underlying ManagedCamera forward by 1 frame for any 'animation' currently in progress which requires the p5Sketches Camera state to be modified in some way (i.e. Changing focus, or changing position in the Sketch)
   */
  advanceCanimations() {
    this.cam.advanceAnimations();
  }

  /**
   * @method mousePositionedOnVertex() - checks if the mouse is positioned on any of the vertices on based on a ray trace, returning the first (matching) Vertex it finds or null if no Vertex is positoned under the mouse
   */
  mousePositionedOnVertex(): VertexImpl | null {
    if (!this.p5cam) return null;
    let mouseTgt: VertexImpl | null = null;

    for (const vert of this.graphset.vertices) {
      if (vert.traceRay(this.p5, this.p5cam)) {
        mouseTgt = vert;
      }
    }
    return mouseTgt;
  }

  /**
   * @method curTgtVertMatchesCurSelectedVertex() - returns true if the hover target id value is a match for the value of the curSelected vertex, if a curSelected vertex exists.
   */
  curTgtVertMatchesCurSelectedVertex(curTgt: Vertex | null) {
    if (!curTgt) return false;
    return curTgt.id === this.state.curSelected()?.id;
  }

  /**
   * @method handleNewSelectionClickTarget() - update the currently hovered global state to null, the currently selected global state to the new target, and adjusts the cameras lookAt target to the clickTarget's position. (This transition wil be animated inside the draw loop... @see ManagedCamera )
   */
  handleNewSelectionClickTarget(clickTgt: VertexImpl) {
    this.state.setCurHovered(null);
    this.state.setCurSelected(clickTgt);
    this.cam.setLookAtTgt(clickTgt.coords);
  }

  //*/==> REQUEST HANDLERS <==/*//
  //*/==> REQUEST HANDLERS <==/*//
  //*/==> REQUEST HANDLERS <==/*//
  //*/==> REQUEST HANDLERS <==/*//
  //*/==> REQUEST HANDLERS <==/*//

  /**
   * @method createPostRequestPayload()
   * Helper method for the POST requests which require a data payload to be sent to the API for calculation
   *
   * @param {string?} altQuery - uses the current this.state.query() @value by default, when present the API fill alter which related data it returns to be relevant to the provided alternate target,
   */
  private createPostRequestPayload(
    altQuery?: string
  ): WikiverseServiceRequestPayload {
    return {
      query: altQuery || this.state.query(),
      ...this.graphset,
      layoutConfig: this.state.layoutConfig(),
    };
  }
  /**
   * @method handleClickToFetchTarget()
   * Use the provided clickTgt to request the information related to it
   *
   * @param {Vertex} clickTgt - the vertex to get infomration about
   * @param {WikiverseService} post - the @method makePostRequest() from the @see WikiverseService
   */
  async handleClickToFetchTarget(
    clickTgt: Vertex,
    post: (
      tgt: string,
      data: WikiverseServiceRequestPayload
    ) => Promise<WikiverseServiceResponse>
  ) {
    // skip when clickToFetch is not true...
    if (!this.state.clickToFetchEnabled()) return;

    const res = await post(
      "click-target",
      this.createPostRequestPayload(clickTgt.id)
    );

    this.graphset.mergeResponseData(res);
    this.state.updateCountTotals(this.graphset);
    this.state.trickCurSelectedUpdate();
  }

  /**
   * @method getInitialRelatedData()
   * A new Wikiverse Sketch call this to grab the related data (Vertices and Edges) for the initial resultant Vertex (the origin)
   *
   * @param {WikiverseService} post - the @method makePostRequest() from the @see WikiverseService
   */
  async getInitialRelatedData(
    post: (
      tgt: string,
      data: WikiverseServiceRequestPayload
    ) => Promise<WikiverseServiceResponse>
  ) {
    const response = await post(
      "fetch-related",
      this.createPostRequestPayload()
    );

    this.graphset.mergeResponseData(response);
    this.state.updateCountTotals(this.graphset);
    this.state.trickCurSelectedUpdate();
  }

  /**
   * @method refreshLayoutPositions()
   * Request a re-run of the layout positioning algorithim which unlocks all of the Vertices (@apiNote - excepts the origin) and re-positions them based on the current Graphset.
   */
  async refreshLayoutPositions(
    post: (
      tgt: string,
      data: WikiverseServiceRequestPayload
    ) => Promise<WikiverseServiceResponse>
  ) {
    const res = await post("refresh-layout", this.createPostRequestPayload());
    this.graphset.updateVertexPositions(res);

    const curSel = this.state.curSelected();
    if (curSel) {
      this.CAM().setLookAtTgt(curSel.coords);
    }
  }

  //*/==> PRIVATE METHODS <==/*//
  //*/==> PRIVATE METHODS <==/*//
  //*/==> PRIVATE METHODS <==/*//
  //*/==> PRIVATE METHODS <==/*//
  //*/==> PRIVATE METHODS <==/*//

  /**
   * @default UI_BG() rgba(1,1,14) color helper;
   */
  private UI_BG = (opac: number = 1) => `rgba(1, 1, 14, ${opac})`;

  /**
   * @default UI_FONT() rgba(245,245,245) color helper;
   */
  private UI_FONT = (opac: number = 1) => `rgba(245, 245, 245, ${opac})`;

  /**
   * @default IN_EDGE() rgba(30,0,255)
   */
  private IN_EDGE = (opac: number = 1) => `rgba(3, 0, 255, ${opac})`;

  /**
   * @default OUT_EDGE() rgba(255,45,80)
   */
  private OUT_EDGE = (opac: number = 1) => `rgba(255, 45, 80, ${opac})`;

  /**
   * @default PARA_EDGE() rgba(135,20,255)
   */
  private PARA_EDGE = (opac: number = 1) => `rgba(135, 20, 255, ${opac})`;

  /**
   * @method drawBoundingBox - Draws a Bounding Box using the MinMax values provided
   */
  private drawBoundingBox(minMax: MinMaxSet) {
    if (!this.state.showBoundingBox()) return;
    this.p5.noFill();
    this.p5.strokeWeight(5);
    this.p5.stroke(this.UI_FONT(0.3));
    this.p5.box(minMax.x.diff, minMax.y.diff, minMax.z.diff);
  }

  /**
   * @method drawMedianOrientaxis - Draws the 3 axis positioned at the center
   */
  private drawAxisOrientation(minMax: MinMaxSet) {
    if (!this.state.showAxisOrientation()) return;
    const xLen = minMax.x.diff / 2;
    const yLen = minMax.y.diff / 2;
    const zLen = minMax.z.diff / 2;
    this.p5.strokeWeight(3);
    this.p5.stroke(255, 0, 0);
    this.p5.line(-xLen, 0, 0, xLen, 0, 0);
    this.p5.stroke(0, 255, 0);
    this.p5.line(0, -yLen, 0, 0, yLen, 0);
    this.p5.stroke(0, 0, 255);
    this.p5.line(0, 0, -zLen, 0, 0, zLen);
    this.p5.noStroke();
  }

  /**
   * @method drawRelatedEdges() - uses the curVert as a contextual starting point for drawing all the Edges existing which mention that Vertex
   */
  private drawRelatedEdges(curVert: VertexImpl) {
    const relatedEdges = this.graphset.getRelatedEdges(curVert);
    if (!relatedEdges) return;

    for (const edge of relatedEdges) {
      const altVert = this.graphset.getAltVertex(edge, curVert);
      if (!altVert) continue;

      const isParallel = edge.hasExistingParallelEdgeInRelated(relatedEdges);
      const curVertCoords = curVert.prevCoords
        ? curVert.calcCoordUpdateVectorPosition(this.p5)
        : curVert.coords;
      const altVertCoords = altVert.prevCoords
        ? altVert.calcCoordUpdateVectorPosition(this.p5)
        : altVert.coords;

      const { x: x1, y: y1, z: z1 } = curVertCoords;
      const { x: x2, y: y2, z: z2 } = altVertCoords;

      this.p5.push();
      this.setEdgeStrokeColor(curVert, edge, isParallel);
      this.p5.line(x1, y1, z1, x2, y2, z2);
      this.p5.pop();
    }
  }

  /**
   * @method setEdgeStrokeColor() - Sets the sketches stroke() color to the correct rgb() value based on the contextually provided curVertex and Edge which is being drawn.
   */
  private setEdgeStrokeColor(curVert: Vertex, edge: Edge, isParallel: boolean) {
    if (isParallel) {
      this.p5.stroke(this.PARA_EDGE());
    } else if (curVert.id === edge.srcId) {
      this.p5.stroke(this.OUT_EDGE());
    } else if (curVert.id === edge.tgtId) {
      this.p5.stroke(this.IN_EDGE());
    } else {
      // to catch those nasty weird edges (otherwise should probably just default? parallel)
      // todo - should be removed from any production
      this.p5.stroke("green");
    }
  }
}
