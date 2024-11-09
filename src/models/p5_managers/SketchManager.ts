import CharisTTF from "../../assets/font/CharisSIL-Regular.ttf";

import { Dispatch, SetStateAction } from "react";
import { Camera, Font } from "p5";
import { P5CanvasInstance } from "@p5-wrapper/react";

import { getAboutTarget, postClickTargetData, postRefreshLayout, postRelatedDataQueue, RequestResponse } from "../../api";
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
  private setReactAboutText: Dispatch<SetStateAction<string | null>>;
  private setReactNavMsg: Dispatch<SetStateAction<string | null>>;
  private setReactShowAboutSketchText: Dispatch<SetStateAction<boolean>>;

  //*/=> SKETCH STATE
  private p5: P5CanvasInstance
  private wikiFont: Font | undefined;
  private cam: Camera | null = null;

  //*/==> DELEGATE-TASK-MANAGER
  private camMngr: CameraManager;
  private uiMngr: UIManager;

  //*/=> DATA STATE
  private curAboutSlide: number = 1;
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
  constructor({ p5, initSketchAPIRes, mainAppLayoutState, isAboutSketch }: SketchManagerProps) {

    // SKETCH STATE
    this.p5 = p5;
    this.camMngr = new CameraManager(p5);
    this.uiMngr = new UIManager(p5);

    // REACT STATE
    this.setReactSelVert = mainAppLayoutState.setSelectedVertex;
    this.setReactHovVert = mainAppLayoutState.setHoveredVertex;
    this.setReactIsLoading = mainAppLayoutState.setIsLoading;
    this.setReactAboutText = mainAppLayoutState.setAboutSketchText;
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
        debugger;
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
        debugger;
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
        debugger;
      })
      .finally(() => {
        this.setReactIsLoading(false);
      })
  }

  /**
   * @method getNextAboutTarget() - called inside of the AboutSketch when user asks to advance to the next slide when the instruction is a click on a Vertex target.
   */
  async getNextAboutTarget(tgtVert: Vertex) {
    if (this.isValidAdvanceCombination(tgtVert)) {
      this.setReactIsLoading(true);
      await getAboutTarget(`${this.curAboutSlide + 1}`)
        .then(res => {
          this.updateAboutNavReactStateMessage(res);
          // update adds data to graphset...
          res.data.vertices.forEach(vert => this.graph.addVertex(vert));
          res.data.properties.forEach(prop => this.graph.addProperty(prop));
          res.data.edges.forEach(edge => this.graph.addEdge(edge));
        })
        .catch(err => {
          console.error(err);
          debugger;
        })
        .finally(() => {
          this.setReactIsLoading(false);
          this.curAboutSlide += 1;
        });
    } else if (this.isValidGetSlide6Request(tgtVert)) {
      this.getAboutSlide6RequestHandler();
    } else if (this.isValidGetSlide10Request(tgtVert)) {
      this.getAboutSlide10RequestHandler();
    }
  }

  aboutSketchHasClickToFetchEnabled(): boolean {
    return this.curAboutSlide >= 10;
  }

  /**
   * @method getNextAboutTargetKeyAdvance() - called inside of the AboutSketch to advance to next slide on slides which don't have a Vertex for the Client to click on which might advance the slide.
   */
  async getNextAboutTargetKeyAdvance() {
    // gets the next slide in the series (i.e. + 1)
    switch (this.curAboutSlide) {
      case 4:
        this.getAboutSlide5RequestHandler();
        break;
      case 6:
        this.getAboutSlide7RequestHandler();
        break;
      case 8:
        this.getAboutSlide9RequestHandler();
        break;
      case 10:
        this.getAboutSlide11RequestHandler(); // final msg for v1
        break;
      case 11:
        this.setReactShowAboutSketchText(false);
        break;
      default:
        break;
    }
  }

  private async getAboutSlide9RequestHandler() {
    this.setReactIsLoading(true);
    await getAboutTarget(`${this.curAboutSlide + 1}`)
      .then(res => {
        this.updateAboutNavReactStateMessage(res);
        this.graph = new Graphset(res.data);
      }).catch(err => {
        console.error(err);
        debugger;
      }).finally(() => {
        this.setReactIsLoading(false);
        this.curAboutSlide += 1;
        this.updateSelectedVertex(null);
        this.camMngr.setLookAtTgt(new Point3D({ x: 0, y: 0, z: 0 }))
      })
  }

  private async getAboutSlide10RequestHandler() {
    this.setReactIsLoading(true);
    await getAboutTarget(`${this.curAboutSlide + 1}`)
      .then(res => {
        this.updateAboutNavReactStateMessage(res);
        // update adds data to graphset...
        res.data.vertices.forEach(vert => this.graph.addVertex(vert));
        res.data.properties.forEach(prop => this.graph.addProperty(prop));
        res.data.edges.forEach(edge => this.graph.addEdge(edge));
      })
      .catch(err => {
        console.error(err);
        debugger;
      }).finally(() => {
        this.setReactIsLoading(false)
        this.curAboutSlide += 1;
        this.updateSelectedVertex(this.graph.getOriginVertex());
      })
  }

  private async getAboutSlide11RequestHandler() {
    this.setReactIsLoading(true);
    await getAboutTarget(`${this.curAboutSlide + 1}`)
      .then(res => {
        this.updateAboutNavReactStateMessage(res);
      }).catch(err => {
        console.error(err)
        debugger;
      }).finally(() => {
        this.setReactIsLoading(false);
        this.curAboutSlide += 1;
      })
  }

  private async getAboutSlide7RequestHandler() {
    this.setReactIsLoading(true)
    this.updateSelectedVertex(null);
    await getAboutTarget(`${this.curAboutSlide + 1}`)
      .then(res => {
        this.updateAboutNavReactStateMessage(res);
        this.graph = new Graphset(res.data);
      }).catch(err => {
        console.error(err);
        debugger;
      }).finally(() => {
        this.setReactIsLoading(false);
        this.curAboutSlide += 1;
        this.camMngr.setLookAtTgt(new Point3D({ x: 0, y: 0, z: 0 }))
        this.updateSelectedVertex(this.graph.getOriginVertex());
        this.camMngr.setPositionTgt(new Point3D({ x: 0, y: 0, z: 350 }))
      });
  }

  private async getAboutSlide5RequestHandler() {
    this.setReactIsLoading(true)
    this.updateSelectedVertex(null);
    await getAboutTarget(`${this.curAboutSlide + 1}`)
      .then(res => {
        this.updateAboutNavReactStateMessage(res);
        this.graph.vertices = res.data.vertices; //reset to new data
      })
      .catch(err => {
        console.error(err);
        debugger;
      })
      .finally(() => {
        this.camMngr.setLookAtTgt(new Point3D({ x: 0, y: 0, z: 0 }))
        this.camMngr.setPositionTgt(new Point3D({ x: 0, y: 0, z: 350 }))
        this.setReactIsLoading(false);
        this.curAboutSlide += 1;
      });
  }

  private async getAboutSlide6RequestHandler() {
    this.setReactIsLoading(true);
    this.camMngr.setPositionTgt(new Point3D({ x: 50, y: -100, z: 560 }))
    this.updateSelectedVertex(null);
    await getAboutTarget(`${this.curAboutSlide + 1}`)
      .then(res => {
        this.graph = new Graphset(res.data);
        this.updateAboutNavReactStateMessage(res);
      })
      .catch(e => {
        console.error(e);
        debugger;
      }).finally(() => {
        this.setReactIsLoading(false)
        this.curAboutSlide += 1;
        //! enable to setup sketch to see related edges on slide 6
        // this.updateSelectedVertex(this.graph.getOriginVertex());
      })
  }
  /**
   * @method updateAboutNavReactStateMessage() - updates the two related react state values for the navigation @ the top of the page. Uses the split(::) to pull out the title...
   */
  private updateAboutNavReactStateMessage(res: RequestResponse) {
    this.setReactAboutText(res.data.query);
    this.setReactNavMsg(res.data.query.split('::').at(0)!)
  }

  /**
   * @method isValidAdvanceCombination() - Inside the AboutSketch this method checks for any of the combination of known valid click tartet and slide requests to check if the click was asking to continue in the tutorial or was other
   */
  private isValidAdvanceCombination(tgtVertex: Vertex): boolean {
    const isGetSlide2Request = tgtVertex.id == 'Q405' && this.curAboutSlide === 1;
    const isGetSlide3Request = tgtVertex.id == 'Q238651' && this.curAboutSlide === 2
    const isGetSlide4Request = tgtVertex.id == 'Q3454165' && this.curAboutSlide === 3;
    const isGetSlide8Request = tgtVertex.id == 'Q33999' && this.curAboutSlide === 7;
    if (isGetSlide2Request) { // small transition back and up right
      this.camMngr.setPositionTgt(new Point3D({ x: 175, y: -100, z: 350 }))
    }

    if (isGetSlide3Request) { // move in direction of selections
      this.camMngr.setPositionTgt(new Point3D({ x: 0, y: -100, z: 350 }))
    }

    if (isGetSlide4Request) { // continues to follow selection
      this.camMngr.setPositionTgt(new Point3D({ x: -100, y: -150, z: 400 }))
    }
    return (isGetSlide2Request || isGetSlide3Request || isGetSlide4Request || isGetSlide8Request);
  }

  /**
   * @method isValidGetSlide6Request() - Inside the AboutSketch this method checks for known combinations of valid slides and targets, to check if the client wants to request the data to advance the AboutSketch to the next slide
   */
  private isValidGetSlide6Request(tgtVertex: Vertex): boolean {
    return ((tgtVertex.id == 'Q3454165' && this.curAboutSlide === 5));
  }

  /**
   * @method isValidGetSlide10Request() - Inside the AboutSketch this method checks for the correct variable presence to request slide10 in the series
   */
  private isValidGetSlide10Request(tgtVertex: Vertex): boolean {
    return ((tgtVertex.id == 'Q3454165' && this.curAboutSlide === 9));
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
      };
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
}