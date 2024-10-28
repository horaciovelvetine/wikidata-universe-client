import CharisTTF from "../../assets/font/CharisSIL-Regular.ttf";

import { Dispatch, SetStateAction } from "react";
import { Camera, Font } from "p5";
import { P5CanvasInstance } from "@p5-wrapper/react";

import { traceRay } from "../../utils";
import { postClickTargetData, postRefreshLayout, postRelatedDataQueue, RequestResponse } from "../../api";
import { CameraManager, Graphset, LayoutConfig, UIManager, Vertex } from "..";
import { calcSafeSketchWindowSize } from "../../components";
import { MainAppLayoutState } from "../../app/MainAppLayoutState";

interface SketchManagerProps {
  p5: P5CanvasInstance;
  initSketchAPIRes: RequestResponse | null;
  mainAppLayoutState: MainAppLayoutState;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setSketchRef: Dispatch<SetStateAction<SketchManager | null>>;
}


export class SketchManager {
  //*/=> REACT STATE
  private setReactSelVert: Dispatch<SetStateAction<Vertex | null>>;
  private setReactHovVert: Dispatch<SetStateAction<Vertex | null>>;
  private setReactIsLoading: Dispatch<SetStateAction<boolean>>;

  //*/=> SKETCH STATE
  private p5: P5CanvasInstance
  private wikiFont: Font | undefined;
  private cam: Camera | null = null;

  //*/==> SUB-MANAGER
  private camMngr: CameraManager;
  private uiMngr: UIManager;

  //*/=> DATA STATE
  private originalQuery: string;
  private graph: Graphset;
  private selectedVertex: Vertex | null = null;
  private hoveredVertex: Vertex | null = null;
  private layoutConfig: LayoutConfig;

  //
  //*/=> CONSTRUCTOR
  //*/=> CONSTRUCTOR
  //*/=> CONSTRUCTOR
  //
  constructor({ p5, initSketchAPIRes, mainAppLayoutState, setSelectedVertex, setHoveredVertex, setSketchRef }: SketchManagerProps) {

    // SKETCH STATE
    this.p5 = p5;
    this.camMngr = new CameraManager(p5);
    this.uiMngr = new UIManager(p5);

    // REACT STATE
    this.setReactSelVert = setSelectedVertex;
    this.setReactHovVert = setHoveredVertex;
    this.setReactIsLoading = mainAppLayoutState.setIsLoading;

    // DATA STATE
    if (initSketchAPIRes != null) {
      this.originalQuery = initSketchAPIRes.data.query;
      this.graph = new Graphset(initSketchAPIRes.data);
      this.layoutConfig = new LayoutConfig(initSketchAPIRes.data.layoutConfig);
      this.updateSelectedVertex(this.graph.getOriginVertex());
    } else {
      this.originalQuery = "No Query Value Provided"
      this.layoutConfig = new LayoutConfig({ dataDensity: 0, attractionMult: 0, repulsionMult: 0 });
      this.graph = new Graphset({ vertices: [], edges: [], properties: [], dimensions: { width: 0, height: 0 } })
    }

    // Pass React back this ref
    setSketchRef(this);
  }

  /**
   * @method UI - gets the stored instance of the UIManager
   */
  UI() {
    return this.uiMngr;
  }

  /**
   * @method CAM - gets the stored instance of the CameraManager
   */
  CAM() {
    return this.camMngr;
  }

  /**
   * @method LAYOUT_CONFIG - gets the stored instance of the LayoutConfig
   */
  LAYOUT_CONFIG() {
    return this.layoutConfig;
  }

  /**
   * @method GRAPH - gets the stored instance of the Graphset
   */
  GRAPH() {
    return this.graph;
  }

  /**
   * @method updateSelectedVertexUpdates - Updates both the sketches internal value, and Reacts state value for the currently selected Vertex state
   */
  updateSelectedVertex(vert: Vertex | null) {
    this.selectedVertex = vert;
    this.setReactSelVert(vert);
  }

  /**
   * @method updateHoveredVertex - Updates both the sketches internal value, and Reacts state value for the currently hovered Vertex state
   */
  updateHoveredVertex(vert: Vertex | null) {
    this.hoveredVertex = vert;
    this.setReactHovVert(vert);
  }

  /**
   * @method preloadFont - Loads the font used for rendering text, called before setup in preload.
   */
  preloadFont() {
    this.wikiFont = this.p5.loadFont(CharisTTF)
  }

  /**
   * @method setTextFont - Sets the loaded font for rendering text, subsequently called in setup.
   */
  setTextFont() {
    this.p5.textFont(this.wikiFont!);
  }

  /**
  * @method createCanvas - Creates the p5 canvas with initial dimensions.
   */
  createCanvas() {
    const { width, height } = calcSafeSketchWindowSize();
    this.p5.createCanvas(width, height, this.p5.WEBGL)
  }

  /**
   * @method initManagedCamera - Initializes the camera and sets it looking at the origin, with a FOV which has modified
   * the FRUSTUM (sp?) to allow the minRender & maxRender to be moved in & out.
   */
  initManagedCamera() {
    this.cam = this.p5.createCamera();
    this.camMngr.setCamera(this.cam);
    // setup cam frustum w/ closer min & further max render distances 
    const aspectRatio = (this.p5.width / this.p5.height);
    const fovRad = (2 * this.p5.atan(this.p5.height / 2 / 800))
    this.p5.perspective(fovRad, aspectRatio, 1, 12000)
  }

  /**
   * @method initCameraPositionAtOriginVertex - Positions the managed camera based on the position of the Vertex marked as the origin, or (0,0,0) if that Vertex could not be found
   */
  initCameraPositionAtOriginVertex() {
    if (this.cam === null) return;
    if (this.graph === null) return;
    const origin = this.graph.getOriginVertex();
    const { x, y, z } = origin ? origin.xyz() : { x: 0, y: 0, z: 0 };
    this.cam.setPosition(x, y, (z + 200));
    this.cam.lookAt(z, (y + 300), z) // look below vertex for init 'pan-up' effect
  }

  /**
 * @method advanceCanimations - Advances camera animations if in progress.
 */
  advanceCanimations() {
    if (this.camMngr.animInProgress())
      this.camMngr.advance()
  }

  /**
   * @method requestPayload() - helper shorthands building a payload for a request to the API
   * @apiNote - the QueryVal is inputted since it is used differently per request...
   */
  private requestPayload(queryVal: string) {
    return {
      query: queryVal, ...this.graph, layoutConfig: this.layoutConfig
    }
  }

  /**
   * @method initPostRelatedDataRequest - Fetches related data and updates the sketch data.
   */
  async initPostRelatedDataRequest() {
    this.setReactIsLoading(true); //==> in-case were here on reload.

    await postRelatedDataQueue(this.requestPayload(this.originalQuery))
      .then(response => {
        this.graph = new Graphset(response.data);
      }).catch(err => {
        console.error(err);
        debugger;
      }).finally(() => {
        this.setReactIsLoading(false);
      });
  }

  /**
   * @method fetchClickTargetData - fetches the details related to the targeted (clicked) Vertex
   */
  async fetchClickTargetData(tgt: Vertex) {
    this.setReactIsLoading(true);

    await postClickTargetData(this.requestPayload(tgt.id))
      .then(response => {
        this.graph = new Graphset(response.data);
      })
      .catch(err => {
        console.error(err);
        debugger;
      })
      .finally(() => {
        this.setReactIsLoading(false);
      });
  }

  /**
   * @method refreshLayoutPositions - unlocks and re-rolls the the layout algorithm with the current Graphset
   */
  async refreshLayoutPositions() {
    this.setReactIsLoading(true);

    await postRefreshLayout(this.requestPayload(this.originalQuery))
      .then(response => {
        this.selectedVertex = null;
        this.setReactSelVert(null);
        this.graph = new Graphset(response.data);
      })
      .catch(err => {
        console.error(err);
        debugger;
      })
      .finally(() => {
        this.setReactIsLoading(false);
      })
  }

  /**
    * @method drawUI - Draws the UI elements.
   */
  drawUI() {
    this.uiMngr.draw(this.graph);
  }

  /**
   * @method drawSelectedDetails - Checks if this Vertex belongs to any of the other specially drawn vertices already,
   * then if not draws the label for this Vertex and all of its connecting edges.
   */
  drawSelectedDetails() {
    if (this.selectedVertex == null) return;
    if (this.selectedVertex.fetched == false) return;
    this.selectedVertex.drawLabel(this.p5, this.cam!, this.wikiFont!)
    this.selectedVertex.drawRelatedEdges(this.p5, this.graph)
  }

  /**
   * @method drawHoveredDetails - Checks if this Vertex belongs to any of the other specially drawn vertices already,
   * then if not draws the label for this Vertex and all of its connecting edges.
   */
  drawHoveredDetails() {
    if (this.hoveredVertex == null) return;
    if (this.hoveredVertex.fetched == false) return;
    this.hoveredVertex.drawLabel(this.p5, this.cam!, this.wikiFont!)
    this.hoveredVertex.drawRelatedEdges(this.p5, this.graph)
  }

  /**
   * @method drawVertices - Draws all vertices in the sketch.
   */
  drawVertices() {
    this.graph.vertices.forEach(vData => {
      if (vData.fetched != false) {
        new Vertex(vData).draw(this.p5, this.selectedVertex);
      };
    })
  }

  /**
   * @method stillHoveredLastVertex - Checks if the last hovered vertex is still hovered.
   */
  stillHoveredLastVertex(): false | number[] {
    if (this.hoveredVertex == null) return false;
    return traceRay(this.p5, this.cam!, this.hoveredVertex)
  }

  /**
   * @method mousePositionIsOnAVertex - Checks if the mouse position is on a vertex.
   */
  mousePositionIsOnAVertex() {
    let mouseTarget: Vertex | null = null;

    this.graph.vertices.forEach(vert => {
      const checkVert = new Vertex(vert);
      if (traceRay(this.p5, this.cam!, checkVert)) {
        mouseTarget = checkVert;
      }
    })
    return mouseTarget;
  }
  /**
   * @method targetIsAlreadyCurSelected - Checks if the target vertex is already selected.
   */
  targetIsAlreadyCurSelected(tgt: Vertex | null) {
    if (tgt == null) return false;
    return tgt.id == this.selectedVertex?.id;
  }

  /**
   * @method handleClickTargetValid - Handles a valid click on a Vertex.
   */
  handleClickTargetValid(tgt: Vertex) {
    this.hoveredVertex = null;
    this.setReactHovVert(null);
    this.selectedVertex = tgt;
    this.setReactSelVert(tgt);
    this.camMngr.setTarget(tgt.coords) // animate camera to new targets coordinates
  }

  /**
   * @method handleResize - Handles resizing of the canvas.
   */
  handleResize() {
    const { width, height } = calcSafeSketchWindowSize();
    this.p5.resizeCanvas(width, height)
  }
}