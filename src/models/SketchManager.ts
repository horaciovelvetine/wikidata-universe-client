import CharisTTF from "../assets/font/CharisSIL-Regular.ttf";

import { Dispatch, SetStateAction } from "react";
import { Camera, Font } from "p5";
import { P5CanvasInstance } from "@p5-wrapper/react";

import { RequestResponse, SessionSettingsState } from "../interfaces";
import { traceRay } from "../utils";
import { postRelatedDataQueue } from "../api";
import { CameraManager, } from "./CameraManager";
import { Graphset, iGraphset } from "./Graphset";
import { Vertex } from "./Vertex";
import { UIManager } from "./UIManager";

interface CoordsSummary {
  id: string,
  label: string | null,
  x: number,
  y: number,
  z: number
}

interface SketchManagerProps {
  p5: P5CanvasInstance;
  initialQueryResponse: RequestResponse | null;
  setWikiverseGraphset: Dispatch<SetStateAction<iGraphset | null>>;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setP5SketchRef: Dispatch<SetStateAction<SketchManager | null>>;
  sessionSettingsState: SessionSettingsState;
}


export class SketchManager {
  //*/=> REACT STATE
  setReactGraphset: Dispatch<SetStateAction<iGraphset | null>>;
  setReactSelVert: Dispatch<SetStateAction<Vertex | null>>;
  setReactHovVert: Dispatch<SetStateAction<Vertex | null>>;
  setReactIsLoading: Dispatch<SetStateAction<boolean>>;

  //*/=> SKETCH STATE
  p5: P5CanvasInstance
  wikiFont: Font | undefined;
  cam: Camera | undefined;
  camMngr: CameraManager;
  uiMngr: UIManager;
  showUnfetchedVertex: boolean;

  //*/=> DATA STATE
  originalQuery: string;
  graph: Graphset;
  selectedVertex: Vertex | null = null;
  hoveredVertex: Vertex | null = null;


  //*/=> CONSTRUCTOR
  constructor({ p5, initialQueryResponse, setWikiverseGraphset, setSelectedVertex, setHoveredVertex, sessionSettingsState, setP5SketchRef }: SketchManagerProps) {

    // REACT STATE
    this.setReactGraphset = setWikiverseGraphset;
    this.setReactSelVert = setSelectedVertex;
    this.setReactHovVert = setHoveredVertex;
    this.setReactIsLoading = sessionSettingsState.setIsLoading;


    // SKETCH STATE
    this.p5 = p5;
    this.camMngr = new CameraManager(p5);
    this.uiMngr = new UIManager(p5, sessionSettingsState);
    this.showUnfetchedVertex = sessionSettingsState.showUnfetchedVertices

    // DATA STATE

    this.graph = new Graphset(initialQueryResponse!.data);
    this.originalQuery = initialQueryResponse!.data.query;

    this.selectedVertex = null;  //new Vertex(this.originVertex);
    this.setReactSelVert(this.selectedVertex);
    setP5SketchRef(this);
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
   * @method toggleShowUnfetchedVertices() - Used as an external hatch to toggle the current value for showUnfetchedVertex being used when drawing the P5.js sketch itself. 
   */
  toggleShowUnfetchedVertices() {
    this.showUnfetchedVertex = !this.showUnfetchedVertex;
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
    const { width, height } = this.calcInitLayoutDimensions();
    this.p5.createCanvas(width, height, this.p5.WEBGL)
  }

  calcInitLayoutDimensions() {
    return { width: Math.round(window.innerWidth * 0.8), height: Math.round(window.innerHeight * 0.85) };
  }



  /**
   * @method initCameraManaged - Initializes the camera and sets it looking at the origin, with a FOV which has modified
   * the FRUSTUM (sp?) to allow the minRender & maxRender to be moved in & out.
   */
  initCameraManaged() {
    this.cam = this.p5.createCamera();
    this.camMngr.setCamera(this.cam);
    // setup cam frustum w/ closer min & further max render distances 
    const aspectRatio = (this.p5.width / this.p5.height);
    const fovRad = (2 * this.p5.atan(this.p5.height / 2 / 800))
    this.p5.perspective(fovRad, aspectRatio, 1, 12000)
    this.cam.setPosition(0, 0, (0 + 250)); // assumes origin is positioned @ (0,0,0)
    this.cam.lookAt(0, (0 + 100), 0) // look slightly below vertex for init 'pan-up' effect
  }

  /**
 * @method advanceCanimations - Advances camera animations if in progress.
 */
  advanceCanimations() {
    if (this.camMngr.animInProgress())
      this.camMngr.advance()
  }

  /**
   * @method initPostRelatedDataRequest - Fetches related data and updates the sketch data.
   */
  async initPostRelatedDataRequest() {
    this.setReactIsLoading(true); //==> in-case were here on reload.

    await postRelatedDataQueue({ query: this.originalQuery, ...this.graph })
      .then(response => {
        this.graph = new Graphset(response.data);
        this.setReactGraphset(this.graph)
      }).catch(e => {
        console.error(e);
        debugger;
      }).finally(() => {
        this.setReactIsLoading(false);
      });
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
    if (this.cam == undefined) return;
    if (this.wikiFont == undefined) return;
    if (this.selectedVertex.fetched == false) return;
    this.selectedVertex.drawLabel(this.p5, this.cam, this.wikiFont)
    // this.selectedVertex.drawRelatedEdges(this.p5, this.data, true)
  }

  /**
   * @method drawHoveredDetails - Checks if this Vertex belongs to any of the other specially drawn vertices already,
   * then if not draws the label for this Vertex and all of its connecting edges.
   */
  drawHoveredDetails() {
    if (this.hoveredVertex == null) return;
    if (this.cam == undefined) return;
    if (this.wikiFont == undefined) return;
    if (this.hoveredVertex.fetched == false) return;
    this.hoveredVertex.drawLabel(this.p5, this.cam, this.wikiFont)
    // this.hoveredVertex.drawRelatedEdges(this.p5, this.data, true)
  }

  /**
   * @method drawVertices - Draws all vertices in the sketch.
   */
  drawVertices() {
    this.graph.vertices.forEach(vData => {
      // console.log(vData)
      if (this.showUnfetchedVertex || vData.fetched != false) {
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
   * @method targetAlreadySelected - Checks if the target vertex is already selected.
   */
  targetAlreadySelected(tgt: Vertex | null) {
    if (tgt == null) return false;
    return tgt.id == this.selectedVertex?.id;
  }

  /**
   * @method handleClickTargetValid - Handles a valid click on a Vertex.
   */
  handleClickTargetValid(tgt: Vertex) {
    if (tgt == null) return;
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
    const { width, height } = this.calcInitLayoutDimensions();
    this.p5.resizeCanvas(width, height)
  }

  /**
   * @method sketchDataCoordsSummary - Helper to print sketchData details to the console
   */
  sketchDataCoordsSummary(): CoordsSummary[] {
    return this.graph.vertices.map(vertex => ({
      id: vertex.id,
      label: vertex.label,
      ...vertex.coords
    }));
  }
}