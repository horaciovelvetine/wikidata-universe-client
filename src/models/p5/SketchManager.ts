import CharisTTF from "../../assets/font/CharisSIL-Regular.ttf";

import { Dispatch, SetStateAction } from "react";
import { Camera, Font } from "p5";
import { P5CanvasInstance } from "@p5-wrapper/react";

import { getTutorialSlideData, postClickTargetData, postRefreshLayout, postRelatedDataQueue, RequestResponse } from "../../api";
import { CameraManager, Graphset, iGraphset, iLayoutConfig, LayoutConfig, Point3D, UIManager, Vertex } from "..";
import { calcSafeSketchWindowSize } from "../../components";
import { MainAppLayoutState } from "../../app/MainAppLayoutState";

interface SketchManagerProps {
  p5: P5CanvasInstance;
  initSketchAPIRes: RequestResponse | null;
  mainAppLayoutState: MainAppLayoutState;
  isAboutSketch: boolean;
}


export class SketchManager {
  //*/=> REACT STATE
  private setReactSelVert: Dispatch<SetStateAction<Vertex | null>>;
  private setReactHovVert: Dispatch<SetStateAction<Vertex | null>>;
  private setReactIsLoading: Dispatch<SetStateAction<boolean>>;
  private setReactTutorialText: Dispatch<SetStateAction<string | null>>;
  private setReactNavMsg: Dispatch<SetStateAction<string | null>>;
  private setReactShowAboutSketchText: Dispatch<SetStateAction<boolean>>;

  //*/=> SKETCH STATE
  private p5: P5CanvasInstance
  private wikiFont: Font | undefined;
  private cam: Camera | null = null;

  //*/==> DELEGATE-TASK-MANAGER
  private camMngr: CameraManager;
  private uiMngr: UIManager;

  //*/==> DATA STATE
  private curAboutSlide: number = 1;
  private originalQuery: string;
  private graph: Graphset;
  private layoutConfig: LayoutConfig;

  //*/==> REACT STATE
  private selectedVertex: Vertex | null = null;
  private hoveredVertex: Vertex | null = null;

  //
  //*/=> CONSTRUCTOR
  //*/=> CONSTRUCTOR
  //*/=> CONSTRUCTOR
  //
  constructor({ p5, initSketchAPIRes, mainAppLayoutState, isAboutSketch }: SketchManagerProps) {

    // SKETCH STATE
    this.p5 = p5;
    this.camMngr = new CameraManager(p5);
    this.uiMngr = new UIManager(p5);

    // REACT STATE
    this.setReactSelVert = mainAppLayoutState.setSelectedVertex;
    this.setReactHovVert = mainAppLayoutState.setHoveredVertex;
    this.setReactIsLoading = mainAppLayoutState.setIsLoading;
    this.setReactTutorialText = mainAppLayoutState.setAboutSketchText;
    this.setReactNavMsg = mainAppLayoutState.setNavStatusMessage
    this.setReactShowAboutSketchText = mainAppLayoutState.setShowAboutSketchText;

    // DATA STATE
    this.originalQuery = initSketchAPIRes!.data.query;
    this.graph = new Graphset(initSketchAPIRes!.data);
    this.layoutConfig = new LayoutConfig(initSketchAPIRes!.data.layoutConfig);
    if (!isAboutSketch) {
      this.updateSelectedVertex(this.graph.getOriginVertex());
    }

    // Pass React back this ref
    mainAppLayoutState.setP5SketchRef(this);
  }

  /**
   * @method UI() - gets the stored instance of the UIManager
   */
  UI() {
    return this.uiMngr;
  }

  /**
   * @method CAM() - gets the stored instance of the CameraManager
   */
  CAM() {
    return this.camMngr;
  }

  /**
   * @method LAYOUT_CONFIG() - gets the stored instance of the LayoutConfig
   */
  LAYOUT_CONFIG() {
    return this.layoutConfig;
  }

  SET_LAYOUT_CONFIG(config: iLayoutConfig) {
    this.layoutConfig = new LayoutConfig(config);
  }

  /**
   * @method GRAPH() - gets the stored instance of the Graphset
   */
  GRAPH() {
    return this.graph;
  }

  SET_GRAPH(graphData: iGraphset) {
    this.graph = new Graphset(graphData);
  }

  /**
   * @method QUERY() - gets the originalQuery value passed into the sketchManager when the sketch was initialized
   */
  QUERY() {
    return this.originalQuery;
  }

  SET_QUERY(query: string) {
    this.originalQuery = query;
  }



  /**
   * @method updateSelectedVertexUpdates() - Updates both the sketches internal value, and Reacts state value for the currently selected Vertex state
   */
  updateSelectedVertex(vert: Vertex | null) {
    this.selectedVertex = vert;
    this.setReactSelVert(vert);
  }

  /**
   * @method updateHoveredVertex() - Updates both the sketches internal value, and Reacts state value for the currently hovered Vertex state
   */
  updateHoveredVertex(vert: Vertex | null) {
    this.hoveredVertex = vert;
    this.setReactHovVert(vert);
  }

  /**
   * @method preloadFont() - Loads the font used for rendering text, called before setup in preload.
   */
  preloadFont() {
    this.wikiFont = this.p5.loadFont(CharisTTF)
  }

  /**
   * @method setTextFont() - Sets the loaded font for rendering text, subsequently called in setup.
   */
  setTextFont() {
    this.p5.textFont(this.wikiFont!);
  }

  /**
  * @method createCanvas() - Creates the p5 canvas with initial dimensions.
   */
  createCanvas() {
    const { width, height } = calcSafeSketchWindowSize();
    this.p5.createCanvas(width, height, this.p5.WEBGL)
  }

  /**
   * @method initManagedCamera() - Initializes the camera and sets it looking at the origin, with a FOV which has modified
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
   * @method initCameraPositionAtOriginVertex() - Positions the managed camera based on the position of the Vertex marked as the origin, or (0,0,0) if that Vertex could not be found
   */
  initCameraPositionAtOriginVertex() {
    if (!this.cam || !this.graph) return;

    const origin = this.graph.getOriginVertex();
    const { x, y, z } = origin ? origin.xyz() : { x: 0, y: 0, z: 0 };

    this.cam.setPosition(x, y, z + 200);
    this.cam.lookAt(x, y + 300, z); // look below vertex for init 'pan-up' effect
    this.camMngr.setLookAtTgt({ x, y, z });
  }

  /**
   * @method initCameraPositionAtAboutStart() - Positions the managed camera at the needed position to properly initialize the AboutSketch
   */
  initCameraPositionAtAboutStart() {
    if (!this.cam || !this.graph) return;

    this.cam.setPosition(0, 0, 350);
    this.cam.lookAt(0, 0, 0);
  }

  /**
  * @method advanceCanimations() - Advances camera animations if in progress.
  */
  advanceCanimations() {
    this.camMngr.advanceAnimations()
  }

  /**
  * @method drawUI() - Draws the UI elements.
 */
  drawUI() {
    this.uiMngr.draw(this.graph);
  }

  /**
   * @method drawSelectedDetails() - Checks if this Vertex belongs to any of the other specially drawn vertices already,
   * then if not draws the label for this Vertex and all of its connecting edges.
   */
  drawSelectedDetails() {
    if (this.selectedVertex == null) return;
    if (this.selectedVertex.fetched == false) return;
    this.selectedVertex.drawLabel(this.p5, this.cam!, this.wikiFont!)
    this.selectedVertex.drawRelatedEdges(this.p5, this.graph)
  }

  /**
   * @method drawHoveredDetails() - Checks if this Vertex belongs to any of the other specially drawn vertices already,
   * then if not draws the label for this Vertex and all of its connecting edges.
   */
  drawHoveredDetails() {
    if (this.hoveredVertex == null) return;
    if (this.hoveredVertex.fetched == false) return;
    this.hoveredVertex.drawLabel(this.p5, this.cam!, this.wikiFont!)
    this.hoveredVertex.drawRelatedEdges(this.p5, this.graph)
  }

  /**
   * @method drawVertices() - Draws all vertices in the sketch.
   */
  drawVertices() {
    this.graph.vertices.forEach(vData => {
      if (vData.fetched != false) {
        new Vertex(vData).draw(this.p5, this.selectedVertex);
      }
    })
  }

  /**
   * @method stillHoveredLastVertex() - Checks if the last hovered vertex is still hovered.
   */
  stillHoveredLastVertex(): false | number[] {
    if (this.hoveredVertex == null) return false;
    return this.hoveredVertex.traceRay(this.p5, this.cam!)
  }

  /**
   * @method mousePositionIsOnAVertex - Checks if the mouse position is on a vertex.
   */
  mousePositionIsOnAVertex() {
    let mouseTarget: Vertex | null = null;

    this.graph.vertices.forEach(vert => {
      const checkVert = new Vertex(vert);
      if (checkVert.traceRay(this.p5, this.cam!)) {
        mouseTarget = checkVert;
      }
    })
    return mouseTarget;
  }
  /**
   * @method targetIsAlreadyCurSelected() - Checks if the target vertex is already selected.
   */
  targetIsAlreadyCurSelected(tgt: Vertex | null) {
    if (tgt == null) return false;
    return tgt.id == this.selectedVertex?.id;
  }

  /**
   * @method handleClickTargetValid() - Handles a valid click on a Vertex.
   */
  handleClickTargetValid(tgt: Vertex) {
    this.hoveredVertex = null;
    this.setReactHovVert(null);
    this.selectedVertex = tgt;
    this.setReactSelVert(tgt);
    this.camMngr.setLookAtTgt(tgt.coords) // animate camera to new targets coordinates
  }

  /**
   * @method handleResize() - Handles resizing of the canvas.
   */
  handleResize() {
    const { width, height } = calcSafeSketchWindowSize();
    this.p5.resizeCanvas(width, height)
  }

  //!===================================================================================================
  //!===================================================================================================
  //!===================================================================================================

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
   * @method initPostRelatedDataRequest() - Fetches related data and updates the sketch data.
   */
  async initPostRelatedDataRequest() {
    this.setReactIsLoading(true); //==> in-case were here on reload.
    await postRelatedDataQueue(this.requestPayload(this.originalQuery))
      .then(response => {
        this.graph = new Graphset(response.data);
      }).catch(err => {
        console.error(err);
      }).finally(() => {
        this.setReactIsLoading(false);
      });
  }

  /**
   * @method fetchClickTargetData() - fetches the details related to the targeted (clicked) Vertex
   */
  async fetchClickTargetData(tgt: Vertex) {
    this.setReactIsLoading(true);
    await postClickTargetData(this.requestPayload(tgt.id))
      .then(response => {
        this.graph = new Graphset(response.data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.updateSelectedVertex(tgt);
        this.setReactIsLoading(false);
      });
  }

  /**
   * @method refreshLayoutPositions() - unlocks and re-rolls the the layout algorithm with the current Graphset
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
      })
      .finally(() => {
        this.setReactIsLoading(false);
      })
  }

  //! ABOUT REQUEST INFRA ================================================================================================================
  //! ABOUT REQUEST INFRA ================================================================================================================
  //! ABOUT REQUEST INFRA ================================================================================================================

  /**
   * @method getNextTutorialSlideByClickTarget() - checks the curAboutSlide against the clicked vertex target for combinations which are the client requesting advancing to the next slide with a click
   */
  async getNextTutorialSlide(tgtVert: Vertex | null) {
    switch (this.curAboutSlide) {
      case 1:
        if (this.isValidSlide2Req(tgtVert))
          this.getSlide2Handler();
        break;
      case 2:
        if (this.isValidSlide3Req(tgtVert))
          this.getSlide3Handler();
        break;
      case 3:
        if (this.isValidSlide45611Req(tgtVert))
          this.getSlide4Handler();
        break;
      case 4:
        if (this.isValidSlide45611Req(tgtVert))
          this.getSlide5Handler();
        break;
      case 5:
        if (this.isValidSlide45611Req(tgtVert))
          this.getSlide6Handler();
        break;
      case 6:
        this.getSlide7Handler(tgtVert)
        break;
      case 7:
        this.getSlide810Handler(tgtVert);
        break;
      case 8:
        if (this.isValidSlide9Req(tgtVert))
          this.getSlide9Handler();
        break;
      case 9:
        this.getSlide810Handler(tgtVert);
        break;
      case 10:
        if (this.isValidSlide45611Req(tgtVert))
          this.getSlide11Handler();
        break;
      //just update text w/ space bar as next inst
      case 11:
      case 12:
        if (tgtVert) return;
        this.setReactIsLoading(true);
        this.simpleTutorialSlideUpdate();
        break;
      case 13:
        if (tgtVert) return;
        this.setReactNavMsg('explore');
        this.setReactShowAboutSketchText(false);
        break;
      default:
        break;
    }
  }

  private isValidSlide2Req(tgt: Vertex | null) {
    return tgt && tgt.id == 'Q405'; //==> 'Moon' id match?
  }

  private async getSlide2Handler() {
    this.setReactIsLoading(true);
    this.camMngr.setPositionTgt(new Point3D({ x: 300, y: -100, z: 275 }));
    this.simpleTutorialSlideUpdate();
  }

  private isValidSlide3Req(tgt: Vertex | null) {
    return tgt && tgt.id == 'Q106428' //==> 'Apollo 13 (film)' id match?
  }

  private async getSlide3Handler() {
    this.setReactIsLoading(true);
    this.camMngr.setPositionTgt(new Point3D({ x: 0, y: -100, z: 350 }));
    this.simpleTutorialSlideUpdate();
  }

  private isValidSlide45611Req(tgt: Vertex | null) {
    return tgt && tgt.id == 'Q3454165'; //==> 'Kevin Bacon' id match?
  }

  private async getSlide4Handler() {
    this.setReactIsLoading(true)
    this.camMngr.setPositionTgt(new Point3D({ x: -100, y: -150, z: 400 }));
    this.simpleTutorialSlideUpdate();
  }

  private async getSlide5Handler() {
    this.setReactIsLoading(true);
    this.updateSelectedVertex(null);
    this.camMngr.setPositionTgt(new Point3D({ x: 0, y: -100, z: 350 }))
    this.camMngr.setLookAtTgt(new Point3D({ x: 0, y: 0, z: 0 }))
    this.resetTutorialSlideUpdate();
  }

  private async getSlide6Handler() {
    this.setReactIsLoading(true);
    this.camMngr.setPositionTgt(new Point3D({ x: 250, y: -100, z: 500 }))
    this.resetTutorialSlideUpdate();
  }

  private async getSlide7Handler(tgtVert: Vertex | null) {
    if (tgtVert) return; // should be null called using space bar
    this.setReactIsLoading(true);
    this.simpleTutorialSlideUpdate(); // no actual data, just new text content
  }

  private async getSlide810Handler(tgtVert: Vertex | null) {
    if (tgtVert) return; // should be null called using space bar
    this.setReactIsLoading(true);
    this.camMngr.setPositionTgt(new Point3D({ x: 0, y: 0, z: 350 }))
    this.camMngr.setLookAtTgt(new Point3D({ x: 0, y: 0, z: 0 }))
    await getTutorialSlideData(this.nextSlideStr())
      .then(res => {
        this.graph = new Graphset(res.data);
        this.updateNavReactStateMessage(res)
        this.curAboutSlide += 1;
      }).finally(() => {
        this.setReactIsLoading(false);
        this.updateSelectedVertex(this.graph.getOriginVertex());
      })
  }

  private isValidSlide9Req(tgtVert: Vertex | null) {
    return tgtVert && tgtVert.id == 'Q33999' //==> 'actor' id match?
  }

  private async getSlide9Handler() {
    this.setReactIsLoading(true);
    this.simpleTutorialSlideUpdate(); // no actual data, just new text content
  }

  private async getSlide11Handler() {
    this.setReactIsLoading(true);
    this.simpleTutorialSlideUpdate();
  }

  //! ABOUT REQUEST HELPERS ======================================================================================================
  //! ABOUT REQUEST HELPERS ======================================================================================================
  //! ABOUT REQUEST HELPERS ======================================================================================================

  /**
   * @method aboutSketchHasClickToFetchEnabled() - checks wether or not the tutorial user is at the stage where click to fetch should be enabled in their sketch
   */
  aboutSketchHasClickToFetchEnabled() {
    return this.curAboutSlide > 10;
  }

  /**
   * @method updateGraphsetWithResponseData() - updates the internal Graphset with the additional details provided for data from the response 
   */
  private updateGraphsetWithResponseData(res: RequestResponse) {
    res.data.vertices.forEach(v => this.GRAPH().addVertex(v));
    res.data.properties.forEach(p => this.GRAPH().addProperty(p));
    res.data.edges.forEach(e => this.GRAPH().addEdge(e));
  }

  /**
   * @method updateNavReactStateMessage() - updates the associate pieces of React's state using the request responses query value where the string is passed
   */
  private updateNavReactStateMessage(res: RequestResponse) {
    this.setReactTutorialText(res.data.query);
    this.setReactNavMsg(res.data.query.split('::').at(0)!)
  }

  /**
   * @method nextSlideStr() - format the curAboutSlide number value as a string to be passed as a query param for the getTutorialSlideData() request
   */
  private nextSlideStr() {
    return `${this.curAboutSlide + 1}`
  }

  /**
   * @method simpleTutorialSlideUpdate() - gets the next Tutorial Slide in sequence, updates the current Graphset with the response and removes the loading state
   */
  private async simpleTutorialSlideUpdate() {
    await getTutorialSlideData(this.nextSlideStr())
      .then(res => {
        this.updateGraphsetWithResponseData(res);
        this.updateNavReactStateMessage(res);
        this.curAboutSlide += 1;
      })
      .finally(() => {
        this.setReactIsLoading(false);
      })
  }

  /**
   * @method resetTutorialSlideUpdate() - gets the next Tutorial Slide in the sequence, then resets the current Graphset with the response data and removes loading state 
   */
  private async resetTutorialSlideUpdate() {
    await getTutorialSlideData(this.nextSlideStr())
      .then(res => {
        this.graph = new Graphset(res.data);
        this.updateNavReactStateMessage(res);
        this.curAboutSlide += 1;
      }).finally(() => {
        this.setReactIsLoading(false);
      })
  }
}