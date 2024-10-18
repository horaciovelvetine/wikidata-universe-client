import CharisTTF from "../assets/font/CharisSIL-Regular.ttf";

import { Dispatch, SetStateAction } from "react";
import { Camera, Font } from "p5";
import { P5CanvasInstance } from "@p5-wrapper/react";

import { CameraManager, Vertex, UIManager } from ".";
import { RequestPayload, RequestResponse, SessionSettingsState, SketchData } from "../interfaces";
import { traceRay } from "../p5/functions";
import { postRelatedDataQueue } from "../api";

interface CoordsSummary {
  id: string,
  label: string,
  x: number,
  y: number,
  z: number
}

interface SketchManagerProps {
  p5: P5CanvasInstance;
  initialQueryResponse: RequestResponse | null;
  setWikiverseSketchData: Dispatch<SetStateAction<SketchData | null>>;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setP5SketchRef: Dispatch<SetStateAction<SketchManager | null>>;
  sessionSettingsState: SessionSettingsState;
}


export class SketchManager {
  //*/=> REACT STATE
  setSketchData: Dispatch<SetStateAction<SketchData | null>>;
  setSelectedVertex: Dispatch<SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<SetStateAction<Vertex | null>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;

  //*/=> SKETCH STATE
  p5: P5CanvasInstance
  wikiFont: Font | undefined; // called in preload... not actual undefined possible
  cam: Camera | undefined;
  camMngr: CameraManager; // camera animation helper(s)
  uiMngr: UIManager;
  showUnfetchedVertex: boolean;

  //*/=> DATA STATE
  originVertex: Vertex
  originalQuery: string;
  data: RequestPayload;
  selectedVertex: Vertex | null = null;
  hoveredVertex: Vertex | null = null;


  //*/=> CONSTRUCTOR
  constructor({ p5, initialQueryResponse, setWikiverseSketchData, setSelectedVertex, setHoveredVertex, sessionSettingsState, setP5SketchRef }: SketchManagerProps) {

    // REACT STATE
    this.setSketchData = setWikiverseSketchData;
    this.setSelectedVertex = setSelectedVertex;
    this.setHoveredVertex = setHoveredVertex;
    this.setIsLoading = sessionSettingsState.setIsLoading;


    // SKETCH STATE
    this.p5 = p5;
    this.camMngr = new CameraManager(p5);
    this.uiMngr = new UIManager(p5, sessionSettingsState);
    this.showUnfetchedVertex = sessionSettingsState.showUnfetchedVertices

    // DATA STATE
    this.data = initialQueryResponse!.data;

    this.originalQuery = this.data.query; //TODO clickToFetchRelated()
    this.originVertex = this.getOriginVertex();

    this.selectedVertex = new Vertex(this.originVertex);
    this.setSelectedVertex(this.selectedVertex);
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
   * @method advanceCanimations - Advances camera animations if in progress.
   */
  advanceCanimations() {
    if (this.camMngr.animInProgress())
      this.camMngr.advance()
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
    const { x, y, z } = this.originVertex.coords;
    this.cam.setPosition(x, y, (z + 150)); // assumes origin is positioned @ (0,0,0)
    this.cam.lookAt(x, (y + 50), z) // look slightly below vertex for init 'pan-up' effect
  }

  /**
   * @method initPostRelatedDataRequest - Fetches related data and updates the sketch data.
   */
  async initPostRelatedDataRequest() {
    this.setIsLoading(true); //==> in-case were here on reload.

    await postRelatedDataQueue(this.data)
      .then(response => {
        this.data = response.data;
        this.setSketchData(this.data)
      }).catch(e => {
        console.error(e);
        debugger;
      }).finally(() => {
        this.setIsLoading(false);
      });
  }

  /**
    * @method drawUI - Draws the UI elements.
   */
  drawUI() {
    this.uiMngr.draw(this.data);
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
    this.data.vertices.forEach(vData => {
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
    this.data.vertices.forEach(vert => {
      const checkVert = new Vertex(vert);
      if (checkVert.fetched == true && traceRay(this.p5, this.cam!, checkVert)) {
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
    if (tgt.fetched == false) return;
    this.hoveredVertex = null;
    this.setHoveredVertex(null);
    this.selectedVertex = tgt;
    this.setSelectedVertex(tgt);
    this.camMngr.setTarget(tgt.coords) // animate camera to new targets coordinates
  }

  /**
   * @method clickTargetIsOrigin - Checks if the clicked target vertex is the origin vertex.
   */
  clickTargetIsOrigin(tgt: Vertex) {
    return tgt.origin;
  }

  /**
   * @method handleResize - Handles resizing of the canvas.
   */
  handleResize() {
    const { width, height } = this.calcInitLayoutDimensions();
    this.p5.resizeCanvas(width, height)
  }

  /**
   * @method getOriginVertex - Finds the Vertex where .origin() == true
   */
  getOriginVertex() {
    return this.data.vertices.find(vertex => vertex.origin === true)!;
  }


  sketchDataCoordsSummary(): CoordsSummary[] {
    return this.data.vertices.map(vertex => ({
      id: vertex.id,
      label: vertex.label,
      ...vertex.coords
    }));
  }
}