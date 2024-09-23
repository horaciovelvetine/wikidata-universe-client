import CharisTTF from "../../assets/font/CharisSIL-Regular.ttf";

import { Dispatch } from "react";
import { Camera, Font } from "p5";
import { P5CanvasInstance } from "@p5-wrapper/react";

import { CameraManager, Vertex, UI } from "./";
import { RequestPayload, SketchData } from "../../interfaces";
import { calcInitLayoutDimensions, traceRay } from "../functions";
import { postRelatedDataQueue } from "../../api";

interface SketchManagerProps {
  p5: P5CanvasInstance;
  initQueryData: RequestPayload;
  setSketchData: Dispatch<React.SetStateAction<SketchData>>;
  setSelectedVertex: Dispatch<React.SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<React.SetStateAction<Vertex | null>>;
  setCameraRef: Dispatch<React.SetStateAction<CameraManager | undefined>>;
}

//!/=> COMPONENT <=/!//
/**
 * Manages the sketch state, including the p5 canvas, camera, UI, and data.
 * Handles interactions with vertices and updates the React state accordingly.
 * 
 * @class SketchManager
 * 
 * @property {Dispatch<React.SetStateAction<SketchData>>} setSketchData - Function to update the sketch data in React state.
 * @property {Dispatch<React.SetStateAction<Vertex | null>>} setSelectedVertex - Function to update the selected vertex in React state.
 * @property {Dispatch<React.SetStateAction<Vertex | null>>} setHoveredVertex - Function to update the hovered vertex in React state.
 * @property {Dispatch<React.SetStateAction<CameraManager | undefined>>} setCameraRef - Function to update the camera manager reference in React state.
 * @property {P5CanvasInstance} p5 - The p5 canvas instance.
 * @property {Font | undefined} wikiFont - The font used for rendering text, loaded in preload.
 * @property {Camera | undefined} cam - The p5 camera instance.
 * @property {CameraManager} camMngr - The camera manager for handling camera animations.
 * @property {UI} ui - The UI manager for drawing UI elements.
 * @property {string} originQuery - The initial query string used to fetch data.
 * @property {SketchData} data - The data used in the sketch, including vertices and edges.
 * @property {Vertex | null} selectedVertex - The currently selected vertex.
 * @property {Vertex | null} hoveredVertex - The currently hovered vertex.
 */
export class SketchManager {

  //*/=> REACT STATE
  setSketchData: Dispatch<React.SetStateAction<SketchData>>;
  setSelectedVertex: Dispatch<React.SetStateAction<Vertex | null>>;
  setHoveredVertex: Dispatch<React.SetStateAction<Vertex | null>>;
  setCameraRef: Dispatch<React.SetStateAction<CameraManager | undefined>>;

  //*/=> SKETCH STATE
  p5: P5CanvasInstance
  wikiFont: Font | undefined; // called in preload... not actual undefined possible
  cam: Camera | undefined;
  camMngr: CameraManager; // camera animation helper(s)
  ui: UI;

  //*/=> DATA STATE
  originQuery: string;
  data: SketchData;
  selectedVertex: Vertex | null = null;
  hoveredVertex: Vertex | null = null;
  // actionsHistory: ActionsHistoryManager;

  //*/=> CONSTRUCTOR
  constructor({ p5, initQueryData, setSketchData, setSelectedVertex, setHoveredVertex, setCameraRef }: SketchManagerProps) {

    // REACT STATE
    this.setSketchData = setSketchData;
    this.setSelectedVertex = setSelectedVertex;
    this.setHoveredVertex = setHoveredVertex;
    this.setCameraRef = setCameraRef;

    // SKETCH STATE
    this.p5 = p5;
    this.camMngr = new CameraManager(p5);
    this.setCameraRef(this.camMngr);
    this.ui = new UI(p5);

    // DATA STATE
    this.originQuery = initQueryData.query
    this.data = { ...initQueryData }
    this.selectedVertex = new Vertex(this.getOriginVertByQuery());
    this.setSelectedVertex(this.selectedVertex);
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
    const { width, height } = calcInitLayoutDimensions();
    this.p5.createCanvas(width, height, this.p5.WEBGL)
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
    this.cam.setPosition(0, 0, 250); // assumes origin is positioned @ (0,0,0)
    this.cam.lookAt(0, 50, 0) // look slightly below vertex for init 'pan-up' effect
  }

  /**
   * @method initPostRelatedDataRequest - Fetches related data and updates the sketch data.
   */
  async initPostRelatedDataRequest() {
    postRelatedDataQueue({ ...this.data, dimensions: calcInitLayoutDimensions(), query: this.originQuery }).then(res => {
      console.log('relatedData Res', res);
      this.data = { ...res.data }
      this.setSketchData({ ...res.data }) // tell react
    }); // TODO - catch for possible fetch related issue catching
  }


  /**
    * @method drawUI - Draws the UI elements.
   */
  drawUI() {
    this.ui.draw(this.data);
  }

  /**
   * @method drawSelectedDetails - Checks if this Vertex belongs to any of the other specially drawn vertices already,
   * then if not draws the label for this Vertex and all of its connecting edges.
   */
  drawSelectedDetails() {
    if (this.selectedVertex == null) return;
    if (this.cam == undefined) return;
    if (this.wikiFont == undefined) return;
    this.selectedVertex.drawLabel(this.p5, this.cam, this.wikiFont)
    this.selectedVertex.drawRelatedEdges(this.p5, this.data, true)
  }

  /**
   * @method drawHoveredDetails - Checks if this Vertex belongs to any of the other specially drawn vertices already,
   * then if not draws the label for this Vertex and all of its connecting edges.
   */
  drawHoveredDetails() {
    if (this.hoveredVertex == null) return;
    if (this.cam == undefined) return;
    if (this.wikiFont == undefined) return;
    this.hoveredVertex.drawLabel(this.p5, this.cam, this.wikiFont)
    this.hoveredVertex.drawRelatedEdges(this.p5, this.data, true)
  }

  /**
   * @method drawVertices - Draws all vertices in the sketch.
   */
  drawVertices() {
    this.data.vertices.forEach(vData => {
      new Vertex(vData).draw(this.p5, this.selectedVertex);
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
      if (traceRay(this.p5, this.cam!, checkVert))
        mouseTarget = checkVert;
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
    return this.originQuery == tgt.label;
  }

  /**
   * @method handleResize - Handles resizing of the canvas.
   */
  handleResize() {
    const { width, height } = calcInitLayoutDimensions();
    this.p5.resizeCanvas(width, height)
  }

  /**
   * @method getOriginVertByQuery - Gets the origin vertex by the initial query string.
   * @note => forced to be truthy for a return value becuase for this to be called, a starting place exists!
   */
  getOriginVertByQuery() {
    return this.data.vertices.find(vertex => vertex.label === this.originQuery)!;
  }
}