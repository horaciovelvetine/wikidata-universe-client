import CharisTTF from "../../assets/font/CharisSIL-Regular.ttf";

import { Dispatch } from "react";
import { Camera, Font } from "p5";
import { P5CanvasInstance } from "@p5-wrapper/react";

import { CameraManager, Vertex, UI, ActionsHistoryManager, Action } from "./";
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
  actionsHistory: ActionsHistoryManager;

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
    this.selectedVertex = new Vertex(this.data.vertices[0]); //todo redo for origin - should base on originQuery
    this.setSelectedVertex(this.selectedVertex);
    this.actionsHistory = new ActionsHistoryManager();
  }

  preloadFont() {
    this.wikiFont = this.p5.loadFont(CharisTTF)
  }

  setTextFont() {
    this.p5.textFont(this.wikiFont!);
  }

  createCanvas() {
    const { width, height } = calcInitLayoutDimensions();
    this.p5.createCanvas(width, height, this.p5.WEBGL)
  }

  advanceCanimations() {
    if (this.camMngr.animInProgress())
      this.camMngr.advance()
  }

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

  async initPostRelatedDataRequest() {
    postRelatedDataQueue({ ...this.data, dimensions: calcInitLayoutDimensions(), query: this.originQuery }).then(res => {
      console.log('relatedData Res', res);
      this.data = { ...res.data }
      this.setSketchData({ ...res.data }) // tell react
    }); // TODO - catch for possible fetch related issue catching
  }

  drawUI() {
    this.ui.draw(this.data);
  }

  drawSelectedDetails() {
    if (this.selectedVertex == null) return;
    if (this.cam == undefined) return;
    if (this.wikiFont == undefined) return;
    this.selectedVertex.drawLabel(this.p5, this.cam, this.wikiFont)
    this.selectedVertex.drawRelatedEdges(this.p5, this.data, true)
  }

  drawHoveredDetails() {
    if (this.hoveredVertex == null) return;
    if (this.cam == undefined) return;
    if (this.wikiFont == undefined) return;
    this.hoveredVertex.drawLabel(this.p5, this.cam, this.wikiFont)
    this.hoveredVertex.drawRelatedEdges(this.p5, this.data, true)
  }

  drawVertices() {
    this.data.vertices.forEach(vData => {
      new Vertex(vData).draw(this.p5, this.selectedVertex);
    })
  }

  stillHoveredLastVertex(): false | number[] {
    if (this.hoveredVertex == null) return false;
    return traceRay(this.p5, this.cam!, this.hoveredVertex)
  }

  mousePositionIsOnAVertex() {
    let mouseTarget: Vertex | null = null;
    this.data.vertices.forEach(vert => {
      const checkVert = new Vertex(vert);
      if (traceRay(this.p5, this.cam!, checkVert))
        mouseTarget = checkVert;
    })
    return mouseTarget;
  }

  targetAlreadySelected(tgt: Vertex | null) {
    if (tgt == null) return false;
    return tgt.id == this.selectedVertex?.id;
  }

  handleClickTargetValid(tgt: Vertex) {
    this.hoveredVertex = null;
    this.setHoveredVertex(null);
    this.selectedVertex = tgt;
    this.setSelectedVertex(tgt);
    // Sketch details...
    this.camMngr.setTarget(tgt.coords)
  }

  clickTargetIsOrigin(tgt: Vertex) {
    return this.originQuery == tgt.label;
  }

  clickTargetInHistory(tgt: Vertex) {
    return this.actionsHistory.alreadyClicked(tgt);
  }

  addClickTargetToHistory(tgt: Vertex) {
    this.actionsHistory.recordNewAction(new Action('click', tgt));
  }

  handleResize() {
    const { width, height } = calcInitLayoutDimensions();
    this.p5.resizeCanvas(width, height)
  }
}