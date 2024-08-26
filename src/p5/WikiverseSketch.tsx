
import CharisTTF from "../assets/font/CharisSIL-Regular.ttf";
import { P5CanvasInstance, ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { Camera, Font } from "p5";

import { calcInitLayoutDimensions, setupCameraView, traceRay, drawSketchUI } from "./functions";
import { Vertex, LookAtChange } from "./models";
import { clickTargetMatchesCurrentSelection, vertexInSelectedHistory } from "./util";

import CharlesSessionDataR2 from '../assets/data/charles-data-r1-2.json'
import { SketchData } from "../interfaces";


interface WikiverSketchProps {
  query: string | undefined;
  setSelectedVertex: React.Dispatch<React.SetStateAction<Vertex | null>>;
  setSketchData: React.Dispatch<React.SetStateAction<SketchData | undefined>>;
  setCamRef: React.Dispatch<React.SetStateAction<Camera | undefined>>
}

const sessionData = (): SketchData => {
  return {
    vertices: CharlesSessionDataR2.vertices,
    edges: CharlesSessionDataR2.edges,
    properties: CharlesSessionDataR2.properties,
    queue: CharlesSessionDataR2.queue,
  }
}

export const WikiverseSketch: React.FC<WikiverSketchProps> = ({ query, setSelectedVertex, setSketchData, setCamRef }) => {
  // SKETCH 
  let wikiFont: Font;
  let cam: Camera;
  const lookAt: LookAtChange = new LookAtChange(null)
  // DATA
  let hoveredVertex: Vertex | null = null;
  let selectedVertex: Vertex | null = null;
  let selectedHistory: Vertex[] = [];
  let session = sessionData();

  const WikiverseSketch: Sketch = (p5: P5CanvasInstance) => {

    //* ==>       <== *//
    //* ==> SETUP <== *//
    //* ==>       <== *//
    p5.preload = () => { wikiFont = p5.loadFont(CharisTTF); };
    p5.setup = () => {
      const { width, height } = calcInitLayoutDimensions();
      p5.createCanvas(width, height, p5.WEBGL);
      p5.textFont(wikiFont!); //set in preload
      cam = setupCameraView(p5, cam);
      setCamRef(cam)
      setSketchData(session)
    };

    //* ==>      <== *//
    //* ==> DRAW <== *//
    //* ==>      <== *//
    p5.draw = () => {
      drawSketchUI(p5, session);

      if (!!selectedVertex) {
        selectedVertex.drawLabel(p5, cam!, wikiFont!);
        selectedVertex.drawRelatedEdges(p5, session);
      }

      if (!!hoveredVertex) {
        hoveredVertex.drawLabel(p5, cam!, wikiFont!);
        hoveredVertex.drawRelatedEdges(p5, session, true);
      }

      session.vertices.forEach((vDat) => {
        new Vertex(vDat).draw(p5);
      });

      if (lookAt.animInProgress()) {
        const { x, y, z } = lookAt.changeVec(p5, cam!);
        cam!.lookAt(x, y, z)
        lookAt.advance();
      }
    };

    //* ==>       <== *//
    //* ==> CLICK <== *//
    //* ==>       <== *//
    p5.mouseClicked = () => {
      session.vertices.forEach((vertexData) => {
        const vert = new Vertex(vertexData);
        if (!traceRay(p5, cam!, vert)) return; // vertex is not click target

        // Deselect current vertex
        if (clickTargetMatchesCurrentSelection(selectedVertex, vert)) {
          selectedVertex = null;
          setSelectedVertex(null);
          return;
        }

        // Select new Vertex
        lookAt.setTarget(vert.coords);
        selectedVertex = vert;
        setSelectedVertex(vert);
        // Fetch new Vertex details...
        if (vert.label == query) return; // origin already fetched...
        if (vertexInSelectedHistory(selectedHistory, vert)) return;
        selectedHistory.push(vert);
        console.log('look for new details...')
      })
    };

    //* ==>       <== *//
    //* ==> HOVER <== *//
    //* ==>       <== *//
    p5.mouseMoved = () => {
      if (hoveredVertex != null) {
        if (traceRay(p5, cam!, hoveredVertex)) return; // same vertex still hovered
      }

      let foundHoveredVert = false;
      session.vertices.forEach(vert => {
        const checkVert = new Vertex(vert);
        if (selectedVertex?.id == checkVert.id) return; // ignore currently selected
        if (traceRay(p5, cam!, checkVert)) {
          hoveredVertex = checkVert;
          foundHoveredVert = true;
        }
      });
      if (!foundHoveredVert) {
        hoveredVertex = null;
      }
    };

    //* ==>        <== *//
    //* ==> RESIZE <== *//
    //* ==>        <== *//
    p5.windowResized = () => {
      const { width, height } = calcInitLayoutDimensions();
      p5.resizeCanvas(width, height);
    };


    p5.keyPressed = (e: KeyboardEvent) => {
      if (e.key == "i") {
        console.log("currentSession", session);
      }
    }
  };

  return <ReactP5Wrapper sketch={WikiverseSketch} />;
};